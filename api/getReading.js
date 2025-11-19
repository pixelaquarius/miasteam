export default async function handler(request, response) {
    // 1. Cấu hình CORS (Cho phép gọi từ web của bạn)
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Xử lý preflight request
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    // 2. Chỉ cho phép POST
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 3. Lấy API Key từ biến môi trường Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'API key configuration missing' });
    }

    try {
        const { contents, generationConfig } = request.body;
        
        // Sử dụng model flash cho nhanh và tiết kiệm
        const modelName = "gemini-1.5-flash";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        const result = await apiResponse.json();
        response.status(200).json(result);

    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'Failed to fetch from AI' });
    }
}
