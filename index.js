const express = require('express');
const cors = require('cors');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(express.json());

// ✅ السماح بكل الطلبات (CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// ✅ خدمة الملفات الثابتة (frontend)
app.use(express.static(path.join(__dirname, 'public')));

const googleClient = new OAuth2Client(
  "133843511650-am6noca4q3m9onveuji00dhb458otu8k.apps.googleusercontent.com"
);

app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || token.trim() === "") {
      return res.status(400).json({ error: 'Google token required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: "133843511650-am6noca4q3m9onveuji00dhb458otu8k.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    res.json({
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      picture: payload.picture
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

// ✅ تشغيل على Replit (عادة يستخدم PORT=5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
