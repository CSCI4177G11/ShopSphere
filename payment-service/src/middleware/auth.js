// src/middleware/auth.js
import jwt from 'jsonwebtoken';

const {
  // MUST match the value used by auth-service (or whatever is issuing the JWTs)
  JWT_SECRET     = 'super-secret-super-secret-super-secret-super-secret',
  JWT_ALGORITHM  = 'HS256',
} = process.env;

/**
 * requireAuth ──────────────────────────────────────────────
 * • Extracts the Bearer token from the Authorization header
 * • Verifies it and attaches the payload as req.user
 * • Responds 401 on failure
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token      = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)                      // strip “Bearer ”
    : '';

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });

    // Uniform user object available to downstream handlers
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

/**
 * requireRole(allowedRoles) ────────────────────────────────
 * Gate-keeps routes to a subset of roles.
 *
 *   router.get('/admin/summary', requireRole(['admin']), ...)
 */
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
