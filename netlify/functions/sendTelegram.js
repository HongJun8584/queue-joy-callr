// Send Telegram message function
// Environment variables: BOT_TOKEN (required), CHAT_ID (optional for default chat)

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Missing BOT_TOKEN' }) 
      };
    }

    let body = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Invalid JSON' }) 
      };
    }

    const { chatId, message } = body;

    if (!message) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Message is required' }) 
      };
    }

    const targetChatId = chatId || process.env.CHAT_ID;

    if (!targetChatId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'chatId is required' }) 
      };
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', result);
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: 'Telegram API error', details: result }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result })
    };

  } catch (error) {
    console.error('Send telegram error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
