// Exemplo de proxy simples em Node.js com Express
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite requisições de qualquer origem
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/blaze-proxy', async (req, res) => {
  try {
    const blazeApiUrl = 'https://blaze.com/api/roulette_games/recent';
    const response = await fetch(blazeApiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados da Blaze:', error);
    res.status(500).json({ error: 'Erro ao carregar dados da Blaze' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
