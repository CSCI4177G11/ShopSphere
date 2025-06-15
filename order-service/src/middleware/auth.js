// src/middleware/auth.js
import jwt from 'jsonwebtoken';

const {
  JWT_SECRET = 'super-secret-super-secret-super-secret-super-secret',  // must match auth‑service
  JWT_ALGORITHM = 'HS256',
} = process.env;

/** Verify Bearer token and attach payload to req.user */
export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });

    req.user = {
      userId: payload.sub,
      role:   payload.role,   // "consumer" | "vendor" | "admin"
      ...payload,
    };
    return next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Require that req.user.role is in allowed[] */
export function requireRole(allowed) {
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    return next();
  };
}
