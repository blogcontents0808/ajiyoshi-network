module.exports = async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('Test API called:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  return res.status(200).json({
    success: true,
    message: 'Vercel Serverless Functions is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};