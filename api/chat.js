const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const systemPrompt = `You are an AI assistant representing Lee Edward Kao. Your purpose is to help potential employers or collaborators learn about Lee's skills and experience. You have access to the information on his resume and portfolio website. You should answer questions professionally and helpfully, focusing on his work in technical product management, enterprise decisioning systems, and leadership. If you are asked about something not related to Lee's professional background, politely steer the conversation back to his skills and projects. Do not make up information that isn't on his resume or website.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.status(200).json({ reply: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
