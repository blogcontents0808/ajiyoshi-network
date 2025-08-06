// レート制限実装
import rateLimit from 'express-rate-limit';

// インメモリストア（簡易版）
const requestCounts = new Map();

function createRateLimit(windowMs = 15 * 60 * 1000, max = 5) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // 古い記録を削除
    if (requestCounts.has(ip)) {
      const requests = requestCounts.get(ip).filter(time => time > windowStart);
      requestCounts.set(ip, requests);
    } else {
      requestCounts.set(ip, []);
    }
    
    const requests = requestCounts.get(ip);
    
    if (requests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    requests.push(now);
    requestCounts.set(ip, requests);
    
    if (next) next();
    return true;
  };
}

// API内で使用
export default async function handler(req, res) {
  // レート制限チェック（15分間で5回まで）
  const rateLimitCheck = createRateLimit(15 * 60 * 1000, 5);
  if (!rateLimitCheck(req, res)) {
    return; // レート制限に引っかかった場合は早期終了
  }
  
  // 続きの処理...
}