import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../config/redis';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-ignore - Redis type compatibility
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Stricter limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: new RedisStore({
    // @ts-ignore
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

// Limiter for order creation
export const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 orders per minute
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-ignore
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: {
    success: false,
    message: 'Too many orders, please slow down.',
  },
});
