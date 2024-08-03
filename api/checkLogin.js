import fetch from 'node-fetch';

export default async (req, res) => {
    const { qrcode_key } = req.query;
    const url = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${qrcode_key}`;

    try {
        const response = await fetch(url,{
            method: 'GET', // 你也可以使用 POST 或其他 HTTP 方法
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67',
                Origin: 'https://www.bilibili.com',
                Referer: 'https://www.bilibili.com/',
            }
        });

        // 从响应头中获取 Set-Cookie
        const cookies = response.headers.get('set-cookie');

        const data = await response.json();

        res.status(200).json({ data, cookies });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
