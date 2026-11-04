export async function onRequest(context) {
  // Обрабатываем OPTIONS-запрос (Preflight безопасности для браузера)
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Обрабатываем строго POST-запрос
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // 1. Берем точное имя переменной, которое прописано у вас в секретах Cloudflare
    const key = context.env.MISTRAL_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: 'API key (VITE_MISTRAL_API_KEY) missing in Cloudflare dashboard secrets.' }), 
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
        }
      );
    }

    const { systemPrompt, query } = await context.request.json();

    // 2. Стучимся на настоящий эндпоинт чата Mistral, а не на сайт компании
    const response = await fetch('https://mistral.ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: 'open-mistral-7b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();

    // 3. Отдаем чистый JSON-ответ во фронтенд
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      }
    );
  }
}