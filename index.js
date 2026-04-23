const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Google setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    res.json({ email: payload.email, name: payload.name });
  } catch (err) {
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

// Apple setup
app.post('/auth/apple', async (req, res) => {
  try {
    const { identityToken } = req.body;
    const decoded = jwt.decode(identityToken);
    res.json({ email: decoded.email, name: decoded.name });
  } catch (err) {
    res.status(400).json({ error: 'Invalid Apple token' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
