// Telegram Webhook for Queue Joy
// Environment variables: BOT_TOKEN (required), CHAT_ID (optional for broadcast)

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let update = {};
    try {
      update = JSON.parse(event.body || '{}');
    } catch (err) {
      console.error('Invalid JSON body', err);
      return { statusCode: 400, body: 'Invalid JSON' };
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const BROADCAST_CHAT_ID = process.env.CHAT_ID || null;

    if (!BOT_TOKEN) {
      console.error('Missing BOT_TOKEN');
      return { statusCode: 500, body: 'Missing BOT_TOKEN' };
    }

    async function sendTelegram(chatId, text) {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        });
        const json = await res.json();
        if (!res.ok) {
          console.warn('Telegram API error:', res.status, json);
        }
        return json;
      } catch (e) {
        console.error('Failed to call Telegram API', e);
        throw e;
      }
    }

    // Handle notification requests from counter.html
    if (update.counterId && update.queueId && update.counterName) {
      const { counterId, queueId, counterName } = update;
      
      if (BROADCAST_CHAT_ID) {
        const message = `👋 Hey!\n🧾 Number • ${queueId}\n🪑 Counter • ${counterName}\n\nYou are now being served! Please proceed to the counter. ☕️😌`;
        await sendTelegram(BROADCAST_CHAT_ID, message);
      }

      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    // Handle /start commands from users
    const msg = update.message || update.edited_message || null;
    const chatId = msg?.chat?.id || null;

    if (!msg || !chatId) {
      return { statusCode: 200, body: 'No message to handle' };
    }

    const text = String(msg.text || '').trim();
    
    // Extract token from /start command
    let tokenRaw = null;
    const startMatch = text.match(/\/start(?:@[\w_]+)?\s+(.+)$/i);
    if (startMatch && startMatch[1]) {
      tokenRaw = startMatch[1].trim();
    }

    if (!tokenRaw) {
      await sendTelegram(chatId, 
        "Hi! To link your queue number, please open the Queue Joy status page and tap 'Connect via Telegram'."
      );
      return { statusCode: 200, body: 'No token provided' };
    }

    // Parse token (base64 JSON or delimited format)
    let queueId = null;
    let counterName = 'TBD';

    try {
      const norm = tokenRaw.replace(/-/g, '+').replace(/_/g, '/');
      const pad = norm.length % 4;
      const padded = pad ? norm + '='.repeat(4 - pad) : norm;
      const decoded = Buffer.from(padded, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === 'object') {
        queueId = parsed.queueId || parsed.queueKey || null;
        counterName = parsed.counterName || parsed.counterId || 'TBD';
      }
    } catch (e) {
      // Not base64 JSON, try delimited format
      const delimiters = ['::', '|', ':'];
      for (const d of delimiters) {
        if (tokenRaw.includes(d)) {
          const [a, b] = tokenRaw.split(d, 2);
          queueId = (a || '').trim();
          counterName = (b || '').trim() || counterName;
          break;
        }
      }
    }

    if (!queueId) {
      queueId = tokenRaw;
    }

    queueId = String(queueId || 'TBD').trim();
    counterName = String(counterName || 'TBD').trim();

    const replyText = `👋 Hey!\n🧾 Number • ${queueId}\n🪑 Counter • ${counterName}\n\nYou are now connected — you can close the browser and Telegram. Everything will be automated. Just sit down and relax. ☕️😌`;

    await sendTelegram(chatId, replyText);

    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('Webhook error:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};
