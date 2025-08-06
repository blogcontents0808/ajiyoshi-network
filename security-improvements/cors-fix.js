// セキュアなCORS設定
export default async function handler(req, res) {
  // 許可するドメインリスト
  const allowedOrigins = [
    'https://ajiyoshi-network.vercel.app',
    'https://ajiyoshi-network-jx2d2hsx9-blogcontents0808s-projects.vercel.app',
    'https://ajiyoshi-network.com', // 独自ドメインがあれば
  ];
  
  const origin = req.headers.origin;
  
  // CORS設定を厳格化
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // 未許可のドメインからのアクセスは拒否
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  // 続きの処理...
}