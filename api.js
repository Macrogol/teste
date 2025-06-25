// api.js no Deno Deploy

import { serve } from "https://deno.land/std@0.207.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const ip_or_domain = url.searchParams.get("target"); // Pega o 'target' da URL da requisição

  if (!ip_or_domain) {
    return new Response(JSON.stringify({ status: "error", message: "Parâmetro 'target' em falta." }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    // Faz o pedido à API ip-api.com a partir do backend
    const apiResponse = await fetch(`http://ip-api.com/json/${ip_or_domain}`);
    const data = await apiResponse.json();

    // Retorna a resposta da API para o frontend
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, // CORS header!
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", message: `Erro no backend: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});