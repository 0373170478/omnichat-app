// Trạm Backend xử lý Webhook & Lưu trữ vĩnh viễn vào Upstash Redis (Vercel Storage)
// Tự động chạy tại: https://omnichat-app-beige.vercel.app/api/webhook

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Hàm gọi lệnh tới Upstash Redis REST API
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'omnichat_fb_verify_2026';

  // 1. XÁC THỰC WEBHOOK VỚI META DEVELOPERS (HTTP GET)
  if (req.method === 'GET' && req.query['hub.mode']) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verify token không khớp');
  }

  // 2. GIAO DIỆN WEB ĐỌC TOÀN BỘ TIN NHẮN & FANPAGE TỪ DATABASE (HTTP GET)
  if (req.method === 'GET' && req.query.action === 'poll') {
    const rawEvents = await redisCommand(['LRANGE', 'omnichat:events', '0', '99']);
    const events = Array.isArray(rawEvents)
      ? rawEvents.map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }).filter(Boolean)
      : [];

    return res.status(200).json({
      ok: true,
      dbConnected: Boolean(REDIS_URL && REDIS_TOKEN),
      events,
    });
  }

  // 3. XỬ LÝ CÁC YÊU CẦU POST
  if (req.method === 'POST') {
    const body = req.body || {};

    // Trường hợp A: Lưu Page Access Token vĩnh viễn vào Database khi kết nối Fanpage
    if (body.action === 'register_pages' && Array.isArray(body.pages)) {
      for (const p of body.pages) {
        if (p.pageId && p.accessToken) {
          await redisCommand(['HSET', 'omnichat:page_tokens', p.pageId, p.accessToken]);
          try {
            await fetch(
              `https://graph.facebook.com/v21.0/${p.pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks,message_deliveries,message_reads&access_token=${encodeURIComponent(
                p.accessToken
              )}`,
              { method: 'POST' }
            );
          } catch (err) {
            console.error('Lỗi đăng ký subscribed_apps:', err);
          }
        }
      }
      return res.status(200).json({ ok: true, registered: body.pages.length });
    }

    // Trường hợp B: Gửi tin nhắn phản hồi thật sang Messenger & lưu lịch sử vào Database
    if (body.action === 'send_reply') {
      const { pageId, recipientPsid, text, pageAccessToken } = body;
      let tokenToUse = pageAccessToken;

      if (!tokenToUse && pageId) {
        tokenToUse = await redisCommand(['HGET', 'omnichat:page_tokens', pageId]);
      }

      if (!tokenToUse || !recipientPsid || !text) {
        return res.status(400).json({
          ok: false,
          error: 'Thiếu Page Access Token, PSID người nhận hoặc nội dung tin nhắn.',
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
              recipient: { id: recipientPsid },
              message: { text },
            }),
          }
        );
        const fbData = await fbRes.json();

        // Lưu cả tin nhắn nhân viên vừa trả lời vào Redis để đồng bộ đa thiết bị
        if (!fbData.error) {
          const agentEvent = {
            id: fbData.message_id || 'agent_' + Date.now(),
            direction: 'outgoing',
            platform: 'facebook',
            pageId: pageId || '',
            senderPsid: recipientPsid,
            text,
            timestamp: Date.now(),
          };
          await redisCommand(['LPUSH', 'omnichat:events', JSON.stringify(agentEvent)]);
          await redisCommand(['LTRIM', 'omnichat:events', '0', '199']);
        }

        return res.status(200).json({ ok: !fbData.error, data: fbData });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    // Trường hợp C: Máy chủ Facebook đẩy tin nhắn mới của khách hàng về
    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        const pageId = entry.id;
        for (const event of entry.messaging || []) {
          if (event.message && !event.message.is_echo) {
            const senderPsid = event.sender.id;
            const text = event.message.text || '[Khách đã gửi hình ảnh / tệp đính kèm]';

            let senderName = `Khách Facebook (${senderPsid.slice(-4)})`;
            let senderAvatar =
              'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=faces';

            const token = await redisCommand(['HGET', 'omnichat:page_tokens', pageId]);
            if (token) {
              try {
                const profileRes = await fetch(
                  `https://graph.facebook.com/v21.0/${senderPsid}?fields=first_name,last_name,profile_pic&access_token=${encodeURIComponent(
                    token
                  )}`
                );
                const profile = await profileRes.json();
                if (profile.first_name || profile.last_name) {
                  senderName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
                }
                if (profile.profile_pic) {
                  senderAvatar = profile.profile_pic;
                }
              } catch (e) {
                // Giữ tên mặc định nếu khách khóa thông tin cá nhân
              }
            }

            const newEvent = {
              id: event.message.mid || 'fb_' + Date.now(),
              direction: 'incoming',
              platform: 'facebook',
              pageId,
              senderPsid,
              senderName,
              senderAvatar,
              text,
              timestamp: event.timestamp || Date.now(),
            };

            // Lưu vĩnh viễn vào danh sách trên Upstash Redis (giữ tối đa 200 tin gần nhất)
            await redisCommand(['LPUSH', 'omnichat:events', JSON.stringify(newEvent)]);
            await redisCommand(['LTRIM', 'omnichat:events', '0', '199']);
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
  }

  return res.status(404).send('Not Found');
}
