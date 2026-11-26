// Trạm Backend Đa Kênh: Facebook Messenger (có hình ảnh) + Zalo Cá Nhân (Bridge) + TikTok Business
// Triển khai tự động tại: https://omnichat-app-beige.vercel.app/api/webhook

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

  if (req.method === 'OPTIONS') return res.status(200).end();

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'omnichat_fb_verify_2026';

  // =========================================================================
  // 1. XÁC THỰC WEBHOOK VỚI META DEVELOPERS (HTTP GET)
  // =========================================================================
  if (req.method === 'GET' && req.query['hub.mode']) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.status(403).send('Verify token không khớp');
  }

  // =========================================================================
  // 1.5. LẤY ẢNH MÃ QR & TRẠNG THÁI ZALO WEB CHO GIAO DIỆN
  // =========================================================================
  if (req.method === 'GET' && req.query.action === 'zalo_qr') {
    const qrData = await redisCommand(['GET', 'omnichat:zalo_qr_base64']);
    const status = (await redisCommand(['GET', 'omnichat:zalo_status'])) || 'waiting_qr';
    return res.status(200).json({
      ok: true,
      status,
      qrImage: qrData || null,
    });
  }

  // =========================================================================
  // 1.8. DỌN SẠCH DỮ LIỆU TIN NHẮN CŨ / LỖI TRONG REDIS (KHI CẦN RESET)
  // =========================================================================
  if (req.method === 'GET' && req.query.action === 'clear_events') {
    await redisCommand(['DEL', 'omnichat:events']);
    await redisCommand(['DEL', 'omnichat:seen_ids']);
    return res.status(200).json({ ok: true, message: 'Đã xóa sạch lịch sử tin nhắn cũ trên Redis!' });
  }

  // =========================================================================
  // 2. POLLING TIN NHẮN ĐA KÊNH CHO GIAO DIỆN WEB
  // =========================================================================
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

  // =========================================================================
  // 3. XỬ LÝ CÁC YÊU CẦU POST
  // =========================================================================
  if (req.method === 'POST') {
    const body = req.body || {};
    const channelParam = req.query.channel;

    // A0. Cập nhật ảnh mã QR Zalo Web & Trạng thái kết nối
    if (body.action === 'update_zalo_qr') {
      if (body.qrImage) {
        await redisCommand(['SET', 'omnichat:zalo_qr_base64', body.qrImage, 'EX', '120']);
      }
      if (body.status) {
        await redisCommand(['SET', 'omnichat:zalo_status', body.status]);
      }
      return res.status(200).json({ ok: true });
    }

    // A. Lưu Page Access Token / Bridge URL vĩnh viễn vào Database
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

    // B. Gửi tin nhắn phản hồi từ Web ra đúng kênh (Facebook / Zalo Cá Nhân / TikTok)
    if (body.action === 'send_reply') {
      const { platform = 'facebook', pageId, recipientPsid, text, pageAccessToken } = body;
      let tokenToUse =
        pageAccessToken || (pageId ? await redisCommand(['HGET', 'omnichat:page_tokens', String(pageId)]) : null);

      if (!tokenToUse || !recipientPsid || !text) {
        return res.status(400).json({
          ok: false,
          error: `Thiếu cấu hình Token/Bridge cho kênh ${platform}.`,
        });
      }

      try {
        if (platform === 'zalo') {
          const bridgeUrl = tokenToUse.startsWith('http') ? tokenToUse : `https://${tokenToUse}`;
          const zaloRes = await fetch(bridgeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: String(recipientPsid), message: text }),
          });
          const zaloData = await zaloRes.json();
          return res.status(200).json({ ok: zaloRes.ok && !zaloData.error, data: zaloData });
        }

        const fbRes = await fetch(
          `https://graph.facebook.com/v21.0/me/messages?access_token=${encodeURIComponent(tokenToUse)}`,
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
          return res.status(400).json({
            ok: false,
            error: `Facebook từ chối gửi: ${fbData.error.message}`,
          });
        }
        return res.status(200).json({ ok: true, data: fbData });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    // C1. Nhận tin nhắn từ Zalo Web Bridge (?channel=zalo_personal)
    if (channelParam === 'zalo_personal' || channelParam === 'zalo' || body.source === 'zalo_personal') {
      const senderId = String(body.senderId || body.userId || '').trim();
      const senderName = String(body.senderName || senderId).trim();
      const text = body.text || (body.imageUrl ? '' : '[Khách Zalo gửi tệp / nhãn dán]');
      const imageUrl = body.imageUrl || null;

      if (senderId && senderName) {
        // Chống lưu trùng lặp tin nhắn Zalo
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
          senderAvatar:
            body.senderAvatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
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

    // C2. Nhận tin nhắn từ Facebook Messenger (Hỗ trợ đầy đủ văn bản + hình ảnh + Lead Form)
    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        const pageId = String(entry.id);
        for (const event of entry.messaging || []) {
          // Bỏ qua các sự kiện không phải tin nhắn hoặc tin nhắn vọng lại (echo) từ Page
          if (!event.message || event.message.is_echo) continue;

          const senderPsid = String(event.sender?.id || '');
          if (!senderPsid || senderPsid === pageId) continue;

          // Chống trùng lặp sự kiện Webhook từ Facebook bằng message.mid
          const mid = String(event.message.mid || `fb_${pageId}_${senderPsid}_${event.timestamp}`);
          const isNew = await redisCommand(['SADD', 'omnichat:seen_ids', mid]);
          if (isNew === 0) continue;
          await redisCommand(['EXPIRE', 'omnichat:seen_ids', '86400']);

          // Trích xuất hình ảnh / tệp đính kèm nếu khách gửi ảnh trên Messenger
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
            (imageUrl ? '' : '[Khách gửi tệp đính kèm / nhãn dán]');

          let senderName = `Khách Facebook (${senderPsid.slice(-4)})`;
          let senderAvatar = '';

          const token = await redisCommand(['HGET', 'omnichat:page_tokens', pageId]);
          if (token) {
            try {
              const profileRes = await fetch(
                `https://graph.facebook.com/v21.0/${senderPsid}?fields=first_name,last_name,name,profile_pic,picture.type(large)&access_token=${encodeURIComponent(
                  token
                )}`
              );
              const profile = await profileRes.json();
              if (profile.name) senderName = profile.name;
              else if (profile.first_name || profile.last_name) {
                senderName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
              }
              // Ưu tiên lấy URL ảnh đại diện độ phân giải cao từ Graph API
              senderAvatar =
                profile.picture?.data?.url ||
                profile.profile_pic ||
                `https://graph.facebook.com/v21.0/${senderPsid}/picture?type=large&access_token=${encodeURIComponent(token)}`;
            } catch (e) {
              senderAvatar = `https://graph.facebook.com/v21.0/${senderPsid}/picture?type=large&access_token=${encodeURIComponent(token)}`;
            }
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
