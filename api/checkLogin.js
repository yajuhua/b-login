import fetch from 'node-fetch';

export default async (req, res) => {
    const { qrcode_key } = req.query;
    const url = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${qrcode_key}`;

    try {
        const response = await fetch(url);

        // 从响应头中获取 Set-Cookie
        const cookies = response.headers.get('set-cookie');

        const data = await response.json();

        res.status(200).json({ data, cookies });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
