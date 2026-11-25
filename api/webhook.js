// Trạm Backend xử lý Webhook nhận & gửi tin nhắn thật từ Facebook Messenger
// Tự động chạy tại địa chỉ: https://omnichat-app-beige.vercel.app/api/webhook

// Bộ nhớ tạm lưu danh sách tin nhắn mới nhận được & Token của từng Fanpage
let recentWebhookEvents = [];
let pageTokensMap = {};

export default async function handler(req, res) {
  // Cho phép giao diện web OmniChat gọi API không bị chặn CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'omnichat_fb_verify_2026';

  // =========================================================================
  // 1. XÁC THỰC WEBHOOK VỚI META DEVELOPERS (HTTP GET)
  // =========================================================================
  if (req.method === 'GET' && req.query['hub.mode']) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Đã xác thực Webhook thành công với Meta!');
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verify token không khớp');
  }

  // =========================================================================
  // 2. GIAO DIỆN WEB LẤY DANH SÁCH TIN NHẮN MỚI NHẬN TỪ FACEBOOK (HTTP GET)
  // =========================================================================
  if (req.method === 'GET' && req.query.action === 'poll') {
    return res.status(200).json({
      ok: true,
      events: recentWebhookEvents
    });
  }

  // =========================================================================
  // 3. XỬ LÝ CÁC YÊU CẦU POST (TỪ FACEBOOK ĐẨY VỀ HOẶC TỪ WEB GỬI ĐI)
  // =========================================================================
  if (req.method === 'POST') {
    const body = req.body || {};

    // Trường hợp A: Giao diện OmniChat lưu Page Access Token sau khi đăng nhập FB
    if (body.action === 'register_pages' && Array.isArray(body.pages)) {
      for (const p of body.pages) {
        if (p.pageId && p.accessToken) {
          pageTokensMap[p.pageId] = p.accessToken;
          // Tự động đăng ký Webhook cho Fanpage này qua Graph API
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

    // Trường hợp B: Nhân viên bấm nút "Gửi" trên web để trả lời khách hàng thật
    if (body.action === 'send_reply') {
      const { pageId, recipientPsid, text, pageAccessToken } = body;
      const tokenToUse = pageAccessToken || pageTokensMap[pageId];

      if (!tokenToUse || !recipientPsid || !text) {
        return res.status(400).json({
          ok: false,
          error: 'Thiếu Page Access Token, PSID người nhận hoặc nội dung tin nhắn.'
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
              message: { text }
            })
          }
        );
        const fbData = await fbRes.json();
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

            // Lấy tên & ảnh đại diện người gửi nếu có Page Access Token
            let senderName = `Khách Facebook (${senderPsid.slice(-4)})`;
            let senderAvatar =
              'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=faces';

            const token = pageTokensMap[pageId];
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
                // Giữ tên mặc định nếu khách khóa quyền xem thông tin cá nhân
              }
            }

            recentWebhookEvents.unshift({
              id: event.message.mid || 'fb_' + Date.now(),
              platform: 'facebook',
              pageId,
              senderPsid,
              senderName,
              senderAvatar,
              text,
              timestamp: event.timestamp || Date.now()
            });

            // Giới hạn lưu 50 tin nhắn gần nhất trong bộ nhớ
            if (recentWebhookEvents.length > 50) {
              recentWebhookEvents = recentWebhookEvents.slice(0, 50);
            }
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
  }

  return res.status(404).send('Not Found');
}
