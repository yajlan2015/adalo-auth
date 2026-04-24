// index.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// ✅ Root route for testing
app.get('/', (req, res) => {
  res.send('Auth server is running 🚀');
});

// ✅ Google OAuth setup
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Google token required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    res.json({
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

// ✅ Apple Sign-In setup
app.post('/auth/apple', async (req, res) => {
  try {
    const { identityToken } = req.body;
    if (!identityToken) {
      return res.status(400).json({ error: 'Apple identity token required' });
    }

    // Decode JWT from Apple
    const decoded = jwt.decode(identityToken);

    if (!decoded) {
      return res.status(400).json({ error: 'Invalid Apple token' });
    }

    res.json({
      email: decoded.email || 'hidden@apple.com', // Apple may hide email
      name: decoded.name || 'Apple User',
      appleId: decoded.sub,
    });
  } catch (err) {
    console.error('Apple auth error:', err);
    res.status(400).json({ error: 'Invalid Apple token' });
  }
});

// ✅ Local development server
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
}

// ✅ Export for Vercel serverless deployment
module.exports = app;
