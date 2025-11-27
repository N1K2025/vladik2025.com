import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // раздаём index.html

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).send('Нет ANTHROPIC_API_KEY');
  }

  const body = {
    model: 'claude-3-5-opus-latest',
    messages,
    max_tokens: 512,
  };

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  res.json(data);
});

app.listen(3000, () => console.log('http://localhost:3000'));
