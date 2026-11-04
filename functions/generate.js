export async function onRequestPost(context) {
  try {
    // 1. Вытаскиваем секретный ключ из панели Cloudflare
    const key = context.env.MISTRAL_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: 'API key (VITE_MISTRAL_API_KEY) not found in Cloudflare secrets' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Получаем данные, которые прислал React
    const { systemPrompt, query } = await context.request.json();

    // 3. Делаем безопасный запрос к Mistral AI
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

    // 4. Возвращаем результат обратно во фронтенд
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
