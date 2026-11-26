const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(commandArray) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commandArray),
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    return null;
  }
}

function extractFacebookAttachment(attachments = []) {
  if (!Array.isArray(attachments) || attachments.length === 0) {
    return { type: 'text', text: '', imageUrl: '', videoUrl: '', fileName: '', fileUrl: '' };
  }

  const first = attachments[0] || {};
  const payload = first.payload || {};
  const url = payload.url || '';

  if (first.type === 'image') {
    return {
      type: 'image',
      text: '[Hình ảnh]',
      imageUrl: url,
      videoUrl: '',
      fileName: 'hinh-anh-messenger.jpg',
      fileUrl: url,
    };
  }

  if (first.type === 'video') {
    return {
      type: 'video',
      text: '[Video]',
      imageUrl: '',
      videoUrl: url,
      fileName: 'video-messenger.mp4',
      fileUrl: url,
    };
  }

  if (first.type === 'audio') {
    return {
      type: 'audio',
      text: '[Tin nhắn thoại]',
      imageUrl: '',
      videoUrl: url,
      fileName: 'ghi-am.mp3',
      fileUrl: url,
    };
  }

  return {
    type: 'file',
    text: payload.title ? `[Tệp: ${payload.title}]` : '[Tệp đính kèm]',
    imageUrl: '',
    videoUrl: '',
    fileName: payload.title || 'tep-dinh-kem',
    fileUrl: url,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'omnichat_fb_verify_2026';

  // 1. Xác thực Webhook với Meta
  if (req.method === 'GET' && req.query['hub.mode']) {
    if (
      req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN
    ) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.status(403).send('Verify token không khớp');
  }

  // 2. Xóa sạch dữ liệu sự kiện cũ trên Redis
  if (req.method === 'GET' && req.query.action === 'clear_events') {
    await redisCommand(['DEL', 'omnichat:events']);
    await redisCommand(['DEL', 'omnichat:seen_ids']);
    return res.status(200).json({ ok: true, cleared: true });
  }

  // 3. Lấy danh sách sự kiện mới cho giao diện
  if (req.method === 'GET' && req.query.action === 'poll') {
    const rawEvents = await redisCommand(['LRANGE', 'omnichat:events', '0', '99']);
    const events = Array.isArray(rawEvents)
      ? rawEvents
          .map((item) => {
            try {
              return JSON.parse(item);
            } catch {
              return null;
            }
          })
          .filter(Boolean)
      : [];

    return res.status(200).json({
      ok: true,
      dbConnected: Boolean(REDIS_URL && REDIS_TOKEN),
      events,
    });
  }

  // 4. Xử lý POST
  if (req.method === 'POST') {
    const body = req.body || {};

    // A. Lưu danh sách Fanpage & Page Access Token vĩnh viễn vào Redis
    if (body.action === 'register_pages' && Array.isArray(body.pages)) {
      let savedCount = 0;
      for (const p of body.pages) {
        if (p.pageId && p.accessToken) {
          await redisCommand(['HSET', 'omnichat:page_tokens', String(p.pageId), p.accessToken]);
          if (p.name) {
            await redisCommand(['HSET', 'omnichat:page_names', String(p.pageId), String(p.name)]);
          }
          savedCount += 1;
          try {
            await fetch(
              `https://graph.facebook.com/v21.0/${p.pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks,message_deliveries,message_reads&access_token=${encodeURIComponent(
                p.accessToken
              )}`,
              { method: 'POST' }
            );
          } catch (e) {}
        }
      }
      return res.status(200).json({ ok: true, registered: savedCount });
    }

    // B. Gửi tin nhắn phản hồi từ Web ra Facebook Messenger
    if (body.action === 'send_reply') {
      const { pageId, recipientPsid, text, pageAccessToken } = body;
      const cleanPageId = String(pageId || '').trim();
      const cleanRecipient = String(recipientPsid || '').trim();
      const cleanText = String(text || '').trim();

      let tokenToUse =
        String(pageAccessToken || '').trim() ||
        (cleanPageId ? await redisCommand(['HGET', 'omnichat:page_tokens', cleanPageId]) : null);

      if (!tokenToUse) {
        return res.status(400).json({
          ok: false,
          error: 'Chưa có Page Access Token của Fanpage này. Hãy kết nối lại Fanpage trong mục Công cụ.',
        });
      }

      if (!cleanRecipient || !cleanText) {
        return res.status(400).json({
          ok: false,
          error: 'Thiếu thông tin người nhận (PSID) hoặc nội dung tin nhắn.',
        });
      }

      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/v21.0/me/messages?access_token=${encodeURIComponent(tokenToUse)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messaging_type: 'RESPONSE',
              recipient: { id: cleanRecipient },
              message: { text: cleanText },
            }),
          }
        );

        const rawText = await fbRes.text();
        let fbData = {};
        try {
          fbData = JSON.parse(rawText);
        } catch {
          fbData = { raw: rawText };
        }

        if (!fbRes.ok || fbData.error) {
          return res.status(400).json({
            ok: false,
            error: fbData.error?.message || 'Facebook từ chối gửi tin nhắn này.',
          });
        }

        return res.status(200).json({ ok: true, data: fbData });
      } catch (err) {
        return res.status(500).json({
          ok: false,
          error: `Lỗi mạng khi gửi tới Facebook: ${err.message}`,
        });
      }
    }

    // C. Nhận tin nhắn thật từ Facebook Messenger Webhook
    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        const pageId = String(entry.id || '');
        const storedPageName = pageId
          ? await redisCommand(['HGET', 'omnichat:page_names', pageId])
          : null;
        const token = pageId
          ? await redisCommand(['HGET', 'omnichat:page_tokens', pageId])
          : null;

        for (const event of entry.messaging || []) {
          const msg = event.message;
          if (!msg || msg.is_echo) continue;

          const senderPsid = String(event.sender?.id || '');
          if (!senderPsid || senderPsid === pageId) continue;

          const eventId =
            msg.mid || `fb_${pageId}_${senderPsid}_${event.timestamp || Date.now()}`;

          const alreadySeen = await redisCommand(['SISMEMBER', 'omnichat:seen_ids', eventId]);
          if (alreadySeen === 1 || alreadySeen === true) continue;
          await redisCommand(['SADD', 'omnichat:seen_ids', eventId]);

          const hasText = typeof msg.text === 'string' && msg.text.trim().length > 0;
          const attachmentInfo = extractFacebookAttachment(msg.attachments);

          const msgType = hasText ? 'text' : attachmentInfo.type;
          const msgText = hasText ? msg.text : attachmentInfo.text;

          let senderName = `Khách Facebook (${senderPsid.slice(-4)})`;
          let senderAvatar = token
            ? `https://graph.facebook.com/v21.0/${senderPsid}/picture?type=large&access_token=${encodeURIComponent(
                token
              )}`
            : '';

          if (token) {
            try {
              const profileRes = await fetch(
                `https://graph.facebook.com/v21.0/${senderPsid}?fields=first_name,last_name,name,profile_pic&access_token=${encodeURIComponent(
                  token
                )}`
              );
              const profile = await profileRes.json();
              if (profile && !profile.error) {
                if (profile.name) {
                  senderName = profile.name;
                } else if (profile.first_name || profile.last_name) {
                  senderName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
                }
                if (profile.profile_pic) {
                  senderAvatar = profile.profile_pic;
                }
              }
            } catch (e) {}
          }

          const newEvent = {
            id: eventId,
            direction: 'incoming',
            platform: 'facebook',
            pageId,
            pageName: storedPageName || 'Fanpage Facebook',
            senderPsid,
            senderName,
            senderAvatar,
            type: msgType,
            text: msgText,
            imageUrl: attachmentInfo.imageUrl,
            videoUrl: attachmentInfo.videoUrl,
            fileName: attachmentInfo.fileName,
            fileUrl: attachmentInfo.fileUrl,
            timestamp: event.timestamp || Date.now(),
          };

          await redisCommand(['LPUSH', 'omnichat:events', JSON.stringify(newEvent)]);
          await redisCommand(['LTRIM', 'omnichat:events', '0', '199']);
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    }
  }

  return res.status(404).send('Not Found');
}
