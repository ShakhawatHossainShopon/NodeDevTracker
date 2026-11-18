/**
 * ফেজ ০১: Node.js ওয়েব ফান্ডামেন্টালস ও নেটিভ HTTP
 * টপিক ০৪: URL পাথ, কুয়েরি স্ট্রিং এবং HTTP রিকোয়েস্ট হেডার পার্সিং
 * 
 * =============================================================================
 * 🌟 সম্পূর্ণ অ্যাপ্লাইড প্রজেক্ট (applied.js) - শর্ট ও ফোকাসড
 * =============================================================================
 * রান করার কমান্ড: node applied.js
 */

import http from 'node:http';

// -----------------------------------------------------------------------------
// ধাপ ১: http.createServer() দিয়ে সার্ভার ইনিশিয়ালাইজ করা
// -----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  // ---------------------------------------------------------------------------
  // ধাপ ২: আধুনিক WHATWG URL API দিয়ে URL ও কুয়েরি পার্স করা
  // ---------------------------------------------------------------------------
  // req.url শুধুমাত্র পাথ ও কুয়েরি দেয় (যেমন: '/api/search?q=phone&limit=5'),
  // তাই সম্পূর্ণ ভ্যালিড URL বানাতে বেইজ হিসেবে `http://${req.headers.host}` দেওয়া হয়
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // ---------------------------------------------------------------------------
  // ধাপ ৩: কুয়েরি প্যারামিটার ও রিকোয়েস্ট হেডার রিড করা
  // ---------------------------------------------------------------------------
  const searchQuery = parsedUrl.searchParams.get('q') || 'all';
  const limit = parseInt(parsedUrl.searchParams.get('limit') || '10', 10);

  // নোড.জেএস ক্লায়েন্টের পাঠানো সব হেডার কি (Key) স্বয়ংক্রিয়ভাবে লোয়ারকেস করে দেয়
  const userAgent = req.headers['user-agent'] || 'unknown';
  const authHeader = req.headers['authorization'] || 'none';

  // টার্মিনালে ক্লিন ইংরেজিতে রিকোয়েস্ট তথ্য প্রিন্ট করা
  console.log(`[REQUEST] Method: ${req.method} | Path: ${pathname}`);
  console.log(`[QUERY] q: "${searchQuery}" | limit: ${limit}`);
  console.log(`[HEADERS] User-Agent: ${userAgent.slice(0, 35)}... | Auth: ${authHeader}\n`);

  // ---------------------------------------------------------------------------
  // ধাপ ৪: পার্স করা ডাটা সহ ক্লায়েন্টে JSON রেসপন্স পাঠানো
  // ---------------------------------------------------------------------------
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (pathname === '/api/search') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'success',
      endpoint: pathname,
      query: { q: searchQuery, limit },
      clientHeaders: {
        authorizationProvided: authHeader !== 'none',
        host: req.headers.host
      }
    }));
  }

  // ৪০৪ ফলব্যাক
  res.statusCode = 404;
  return res.end(JSON.stringify({
    status: 'error',
    message: `Route '${pathname}' not found. Try '/api/search?q=laptop&limit=5'`
  }));
});

// -----------------------------------------------------------------------------
// ধাপ ৫: ৩০০০ পোর্টে সার্ভার চালু করা
// -----------------------------------------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Server started on http://localhost:${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/search?q=laptop&limit=5`);
});
