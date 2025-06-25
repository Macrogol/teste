// server.js

const express = require('express');
const cors = require('cors'); // Para permitir que o seu frontend o contacte
const fetch = require('node-fetch'); // Para fazer requisições HTTP a APIs externas (ip-api.com)

const app = express();
// A porta é definida pela plataforma de alojamento (Render, Railway, Vercel)
// O process.env.PORT garante que a aplicação use a porta que o ambiente de produção fornece.
const port = process.env.PORT || 3000; 

// Middleware para habilitar o CORS.
// Isso é CRUCIAL para que o seu frontend (que estará noutro domínio) possa fazer pedidos a este backend.
app.use(cors());

// Rota da API para procurar informações de IP
// Quando o seu frontend chamar '/api/ip-lookup?target=algumIP', este código será executado.
app.get('/api/ip-lookup', async (req, res) => {
  const target = req.query.target; // Obtém o valor do parâmetro 'target' da URL da requisição

  // Validação: verifica se o parâmetro 'target' foi fornecido
  if (!target) {
    return res.status(400).json({ status: "error", message: "Parâmetro 'target' em falta." });
  }

  try {
    // Faz a requisição à API ip-api.com (aqui é onde o proxy acontece)
    const apiResponse = await fetch(`http://ip-api.com/json/${target}`);
    
    // Converte a resposta da API (que está em JSON) para um objeto JavaScript
    const data = await apiResponse.json();

    // Envia a resposta da ip-api.com de volta para o seu frontend
    res.json(data);
  } catch (error) {
    // Lida com erros que possam ocorrer durante a requisição à ip-api.com
    console.error("Erro no backend ao consultar ip-api.com:", error);
    res.status(500).json({ status: "error", message: `Erro no backend: ${error.message}` });
  }
});

// Rota de raiz (/) do seu servidor. 
// Isso é útil para verificar se o seu servidor está online.
app.get('/', (req, res) => {
  res.send('O seu backend de IP lookup está a funcionar! Use /api/ip-lookup?target=SEU_IP_OU_DOMINIO');
});

// Inicia o servidor e faz com que ele "ouça" as requisições na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});