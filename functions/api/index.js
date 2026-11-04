export async function onRequest(context) {
  // Обрабатываем OPTIONS-запрос (Preflight для браузера)
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
    const key = context.env.MISTRAL_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: 'API key (VITE_MISTRAL_API_KEY) missing in Cloudflare dashboard' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { systemPrompt, query } = await context.request.json();

    // ДОЛЖНО БЫТЬ СТРОГО ТАК:
    const response = await fetch('https://mistral.ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key.trim()}`, // Проверьте, что ключ берется из VITE_MISTRAL_API_KEY
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
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
