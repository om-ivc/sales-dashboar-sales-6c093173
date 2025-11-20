import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    ...options,
  });
}

export function verifyToken(token) {
  try {
    return { payload: jwt.verify(token, JWT_SECRET), error: null };
  } catch (error) {
    return { payload: null, error };
  }
}