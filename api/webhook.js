// Trạm Backend Đa Kênh Chuẩn Hóa - Chống trùng lặp & Chống lẫn hội thoại
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
    console.error('Lỗi Redis:', err);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'omnichat_fb_verify_2026';

  // 1. XÁC THỰC WEBHOOK FACEBOOK
  if (req.method === 'GET' && req.query['hub.mode']) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.status(403).send('Verify token không khớp');
  }

  // 2. POLLING TIN NHẮN CHO GIAO DIỆN WEB
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

  // 3. XỬ LÝ POST (LƯU TOKEN, GỬI TIN ĐI, NHẬN WEBHOOK)
  if (req.method === 'POST') {
    const body = req.body || {};

    // A. Lưu Page Access Token vào Redis
    if (body.action === 'register_pages' && Array.isArray(body.pages)) {
      for (const p of body.pages) {
        if (p.pageId && p.accessToken) {
          await redisCommand(['HSET', 'omnichat:page_tokens', String(p.pageId), p.accessToken]);
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
      return res.status(200).json({ ok: true, registered: body.pages.length });
    }

    // B. Gửi tin nhắn phản hồi từ Admin ra Facebook Messenger
    if (body.action === 'send_reply') {
      const { pageId, recipientPsid, text, pageAccessToken } = body;
      let tokenToUse = pageAccessToken;

      if (!tokenToUse && pageId) {
        tokenToUse = await redisCommand(['HGET', 'omnichat:page_tokens', String(pageId)]);
      }

      if (!tokenToUse) {
        return res.status(400).json({
          ok: false,
          error: `Chưa tìm thấy Page Access Token cho Page ID: ${pageId}. Vui lòng kết nối lại Fanpage!`,
        });
      }

      if (!recipientPsid || !text) {
        return res.status(400).json({
          ok: false,
          error: 'Thiếu PSID khách hàng hoặc nội dung tin nhắn.',
        });
      }

      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/v21.0/me/messages?access_token=${encodeURIComponent(
            tokenToUse
          )}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messaging_type: 'RESPONSE',
              recipient: { id: String(recipientPsid) },
              message: { text },
            }),
          }
        );
        const fbData = await fbRes.json();

        if (fbData.error) {
          console.error('Lỗi Facebook Send API:', fbData.error);
          return res.status(400).json({
            ok: false,
            error: `Facebook từ chối gửi: ${fbData.error.message} (Mã lỗi: ${fbData.error.code})`,
          });
        }

        return res.status(200).json({ ok: true, data: fbData });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    // C. Nhận Webhook từ Facebook Messenger
    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        const pageId = String(entry.id);
        for (const event of entry.messaging || []) {
          // CHẶN TUYỆT ĐỐI tin nhắn echo hoặc tin do chính Page gửi đi (tránh tạo khách ảo 5590)
          if (!event.message || event.message.is_echo) continue;
          const senderPsid = String(event.sender?.id || '');
          if (!senderPsid || senderPsid === pageId) continue;

          const text = event.message.text || '[Khách gửi hình ảnh / tệp đính kèm]';
          let senderName = `Khách Facebook (${senderPsid.slice(-4)})`;
          let senderAvatar =
            'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=faces';

          const token = await redisCommand(['HGET', 'omnichat:page_tokens', pageId]);
          if (token) {
            try {
              const profileRes = await fetch(
                `https://graph.facebook.com/v21.0/${senderPsid}?fields=first_name,last_name,name,profile_pic&access_token=${encodeURIComponent(
                  token
                )}`
              );
              const profile = await profileRes.json();
              if (profile.name) {
                senderName = profile.name;
              } else if (profile.first_name || profile.last_name) {
                senderName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
              }
              if (profile.profile_pic) senderAvatar = profile.profile_pic;
            } catch (e) {}
          }

          const newEvent = {
            id: event.message.mid || 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            direction: 'incoming',
            platform: 'facebook',
            pageId: pageId,
            senderPsid: senderPsid,
            senderName: senderName,
            senderAvatar: senderAvatar,
            text: text,
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
