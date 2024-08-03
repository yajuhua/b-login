// api/generateQrcode.js

export default async (req, res) => {
    const url = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header';

    try {
        const response = await fetch(url,{
            method: 'GET', // 你也可以使用 POST 或其他 HTTP 方法
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67',
                Origin: 'https://www.bilibili.com',
                Referer: 'https://www.bilibili.com/',
            }
        });
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
