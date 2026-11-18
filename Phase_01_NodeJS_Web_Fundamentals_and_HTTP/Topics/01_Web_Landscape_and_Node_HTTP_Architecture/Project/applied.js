/**
 * ফেজ ০১: Node.js ওয়েব ফান্ডামেন্টালস ও নেটিভ HTTP
 * টপিক ০১: আধুনিক Node.js ওয়েব ল্যান্ডস্কেপ ও নেটিভ HTTP আর্কিটেকচার
 * 
 * =============================================================================
 * 🌟 সম্পূর্ণ অ্যাপ্লাইড প্রজেক্ট (applied.js) - শর্ট ও ফোকাসড
 * =============================================================================
 * রান করার কমান্ড: node applied.js
 */

import http from 'node:http';

// -----------------------------------------------------------------------------
// ধাপ ১: http.createServer() দিয়ে সার্ভার তৈরি করুন
// -----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  // ১. হেডার সেট করা (আমরা ব্রাউজারকে JSON ডাটা পাঠাচ্ছি)
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // ২. রুট চেক করা: হোম রুট ('/')
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      message: 'Welcome to Node.js native HTTP server!',
      status: 'success'
    }));
  }

  // ৩. রুট চেক করা: স্ট্যাটাস রুট ('/api/status')
  if (req.method === 'GET' && req.url === '/api/status') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      server: 'running',
      uptime: Math.floor(process.uptime()) + ' seconds',
      nodeVersion: process.version
    }));
  }

  // ৪. কোনো রুট না মিললে ৪০৪ (Not Found) রেসপন্স
  res.statusCode = 404;
  return res.end(JSON.stringify({
    error: 'Not Found',
    message: `Path '${req.url}' was not found!`
  }));
});

// -----------------------------------------------------------------------------
// ধাপ ২: সার্ভারটি ৩০০০ পোর্টে চালু (Listen) করুন
// -----------------------------------------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Server started on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/status`);
});
