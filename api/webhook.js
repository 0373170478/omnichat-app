// Trạm Backend Đa Kênh: Facebook Messenger + Zalo Cá Nhân (Bridge) + TikTok Business
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
    console.error('Lỗi kết nối Redis:', err);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'omnichat_fb_verify_2026';

  if (req.method === 'GET' && req.query['hub.mode']) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.status(403).send('Verify token không khớp');
  }

  if (req.method === 'GET' && req.query.action === 'zalo_qr') {
    const qrData = await redisCommand(['GET', 'omnichat:zalo_qr_base64']);
    const status = (await redisCommand(['GET', 'omnichat:zalo_status'])) || 'waiting_qr';
    return res.status(200).json({ ok: true, status, qrImage: qrData || null });
  }

  if (req.method === 'GET' && req.query.action === 'clear_events') {
    await redisCommand(['DEL', 'omnichat:events']);
    await redisCommand(['DEL', 'omnichat:seen_ids']);
    return res.status(200).json({ ok: true, message: 'Đã xóa sạch lịch sử tin nhắn cũ trên Redis!' });
  }

  if (req.method === 'GET' && req.query.action === 'poll') {
    const rawEvents = await redisCommand(['LRANGE', 'omnichat:events', '0', '149']);
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

  if (req.method === 'POST') {
    const body = req.body || {};
    const channelParam = req.query.channel;

    if (body.action === 'update_zalo_qr') {
      if (body.qrImage) {
        await redisCommand(['SET', 'omnichat:zalo_qr_base64', body.qrImage, 'EX', '120']);
      }
      if (body.status) {
        await redisCommand(['SET', 'omnichat:zalo_status', body.status]);
      }
      return res.status(200).json({ ok: true });
    }

    if (body.action === 'register_pages' && Array.isArray(body.pages)) {
      for (const p of body.pages) {
        if (p.pageId && p.accessToken) {
          await redisCommand(['HSET', 'omnichat:page_tokens', String(p.pageId), p.accessToken]);
          if (!p.platform || p.platform === 'facebook') {
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
      }
      return res.status(200).json({ ok: true, registered: body.pages.length });
    }

    // Gửi tin nhắn phản hồi từ Web ra Facebook / Zalo / TikTok
    if (body.action === 'send_reply') {
      const { platform = 'facebook', pageId, recipientPsid, text, pageAccessToken } = body;
      const cleanPageId = String(pageId || '').trim();
      const cleanRecipient = String(recipientPsid || '').trim();
      const cleanText = String(text || '').trim();

      let tokenToUse =
        String(pageAccessToken || '').trim() ||
        (cleanPageId ? await redisCommand(['HGET', 'omnichat:page_tokens', cleanPageId]) : null);

      if (!tokenToUse) {
        return res.status(400).json({
          ok: false,
          error: 'Thiếu Page Access Token của Fanpage. Hãy vào Công cụ > Facebook > Thêm fanpage để lưu Token.',
        });
      }

      if (!cleanRecipient || !cleanText) {
        return res.status(400).json({
          ok: false,
          error: 'Thiếu ID người nhận (PSID) hoặc nội dung tin nhắn.',
        });
      }

      try {
        if (platform === 'zalo') {
          const bridgeUrl = tokenToUse.startsWith('http') ? tokenToUse : `https://${tokenToUse}`;
          const zaloRes = await fetch(bridgeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: cleanRecipient, message: cleanText }),
          });
          const rawText = await zaloRes.text();
          let zaloData = {};
          try {
            zaloData = JSON.parse(rawText);
          } catch {
            return res.status(400).json({
              ok: false,
              error: 'Đường hầm Zalo Bridge không trả về JSON hợp lệ.',
            });
          }
          if (!zaloRes.ok || zaloData.error) {
            return res.status(400).json({
              ok: false,
              error: zaloData.error || 'Zalo Bridge từ chối gửi tin.',
            });
          }
          return res.status(200).json({ ok: true, data: zaloData });
        }

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

        const rawFbText = await fbRes.text();
        let fbData = {};
        try {
          fbData = JSON.parse(rawFbText);
        } catch {
          fbData = { raw: rawFbText };
        }

        if (!fbRes.ok || fbData.error) {
          return res.status(400).json({
            ok: false,
            error: fbData.error?.message || 'Facebook từ chối gửi tin nhắn này.',
          });
        }

        return res.status(200).json({ ok: true, data: fbData });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    // Nhận tin nhắn Zalo Web Bridge
    if (channelParam === 'zalo_personal' || channelParam === 'zalo' || body.source === 'zalo_personal') {
      const senderId = String(body.senderId || body.userId || '').trim();
      const senderName = String(body.senderName || senderId).trim();
      const text = body.text || (body.imageUrl ? '' : '[Khách Zalo gửi tệp / nhãn dán]');
      const imageUrl = body.imageUrl || null;

      if (senderId && senderName) {
        const uniqueMsgId = String(body.msgId || `zweb_${senderId}_${text}_${imageUrl || ''}`);
        const isNew = await redisCommand(['SADD', 'omnichat:seen_ids', uniqueMsgId]);
        if (isNew === 0) {
          return res.status(200).json({ ok: true, duplicate: true });
        }
        await redisCommand(['EXPIRE', 'omnichat:seen_ids', '86400']);

        const newEvent = {
          id: uniqueMsgId,
          direction: 'incoming',
          platform: 'zalo',
          pageId: 'zalo_personal_main',
          senderPsid: senderId,
          senderName,
          senderAvatar: body.senderAvatar || '',
          type: imageUrl ? 'image' : 'text',
          imageUrl,
          text,
          timestamp: body.timestamp || Date.now(),
        };
        await redisCommand(['LPUSH', 'omnichat:events', JSON.stringify(newEvent)]);
        await redisCommand(['LTRIM', 'omnichat:events', '0', '299']);
      }
      return res.status(200).json({ ok: true });
    }

    // Nhận tin nhắn từ Facebook Messenger
    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        const pageId = String(entry.id || '');
        for (const event of entry.messaging || []) {
          if (!event.message || event.message.is_echo) continue;

          const senderPsid = String(event.sender?.id || '');
          if (!senderPsid || senderPsid === pageId) continue;

          const mid = String(event.message.mid || `fb_${pageId}_${senderPsid}_${event.timestamp}`);
          const isNew = await redisCommand(['SADD', 'omnichat:seen_ids', mid]);
          if (isNew === 0) continue;
          await redisCommand(['EXPIRE', 'omnichat:seen_ids', '86400']);

          let imageUrl = null;
          let msgType = 'text';
          const attachments = event.message.attachments || [];
          if (attachments.length > 0) {
            const firstAtt = attachments[0];
            if (firstAtt.type === 'image' && firstAtt.payload?.url) {
              msgType = 'image';
              imageUrl = firstAtt.payload.url;
            }
          }

          const text =
            event.message.text ||
            (imageUrl ? '' : '[Khách gửi hình ảnh / tệp đính kèm]');

          let senderName = `Khách Facebook (${senderPsid.slice(-4)})`;
          let senderAvatar = '';

          const token = pageId
            ? await redisCommand(['HGET', 'omnichat:page_tokens', pageId])
            : null;

          if (token) {
            senderAvatar = `https://graph.facebook.com/v21.0/${senderPsid}/picture?type=large&access_token=${encodeURIComponent(
              token
            )}`;

            try {
              const profileRes = await fetch(
                `https://graph.facebook.com/v21.0/${senderPsid}?fields=first_name,last_name,name,profile_pic,picture.type(large)&access_token=${encodeURIComponent(
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
                if (profile.picture?.data?.url) {
                  senderAvatar = profile.picture.data.url;
                } else if (profile.profile_pic) {
                  senderAvatar = profile.profile_pic;
                }
              }
            } catch (e) {}
          }

          const newEvent = {
            id: mid,
            direction: 'incoming',
            platform: 'facebook',
            pageId,
            senderPsid,
            senderName,
            senderAvatar,
            type: msgType,
            imageUrl,
            text,
            timestamp: event.timestamp || Date.now(),
          };
          await redisCommand(['LPUSH', 'omnichat:events', JSON.stringify(newEvent)]);
          await redisCommand(['LTRIM', 'omnichat:events', '0', '299']);
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
  }

  return res.status(404).send('Not Found');
}
