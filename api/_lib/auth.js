const crypto = require('crypto');

const secret = () => {
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is not configured');
  return process.env.SESSION_SECRET;
};

const hmac = (value) => crypto.createHmac('sha256', secret()).update(value).digest('base64url');

// Constant-time string comparison (compares fixed-length digests, so lengths don't leak)
const safeEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || !b) return false;
  return crypto.timingSafeEqual(Buffer.from(hmac(a)), Buffer.from(hmac(b)));
};

// Minimal signed token: base64url(payload).signature
const signToken = (payload, ttlSeconds) => {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttlSeconds * 1000 })).toString('base64url');
  return `${body}.${hmac(body)}`;
};

const verifyToken = (token) => {
  if (typeof token !== 'string') return null;
  const [body, signature] = token.split('.');
  if (!body || !signature || !safeEqual(signature, hmac(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
};

const bearerToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

module.exports = { safeEqual, signToken, verifyToken, bearerToken };
