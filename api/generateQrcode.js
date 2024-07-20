// api/generateQrcode.js

export default async (req, res) => {
    const url = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate';

    try {
        const response = await fetch(url);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
