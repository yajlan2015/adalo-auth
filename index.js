const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(express.json());

// ✅ إعداد Google OAuth Client
const googleClient = new OAuth2Client(
  "133843511650-am6noca4q3m9onveuji00dhb458otu8k.apps.googleusercontent.com"
);

// ✅ Route للتحقق من Google Token
app.post('/auth/google', async (req, res) => {
  try {
    const { token, email, name, picture } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token required' });
    }

    // تحقق من التوكن مع Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: "133843511650-am6noca4q3m9onveuji00dhb458otu8k.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();

    // رجع بيانات المستخدم
    res.json({
      email: email || payload.email,
      name: name || payload.name,
      googleId: payload.sub,
      picture: picture || payload.picture
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

// ✅ تشغيل محلي
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
}

// ✅ تصدير لـ Vercel
module.exports = app;
