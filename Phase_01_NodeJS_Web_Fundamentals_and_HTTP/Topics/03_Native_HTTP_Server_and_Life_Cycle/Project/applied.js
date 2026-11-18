/**
 * ফেজ ০১: Node.js ওয়েব ফান্ডামেন্টালস ও নেটিভ HTTP
 * টপিক ০৩: নেটিভ HTTP সার্ভার ও Request/Response লাইফসাইকেল
 * 
 * =============================================================================
 * 🌟 সম্পূর্ণ অ্যাপ্লাইড প্রজেক্ট (applied.js) - শর্ট ও ফোকাসড
 * =============================================================================
 * রান করার কমান্ড: node applied.js
 */

import http from 'node:http';

// -----------------------------------------------------------------------------
// ধাপ ১: http.createServer() দিয়ে সার্ভার তৈরি
// -----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  // ---------------------------------------------------------------------------
  // ধাপ ২: রিকোয়েস্ট শুরু হওয়ার সময় রেকর্ড করা
  // ---------------------------------------------------------------------------
  const startTime = Date.now();

  // ---------------------------------------------------------------------------
  // ধাপ ৩: `res.on('finish')` লাইফসাইকেল ইভেন্ট শোনা
  // ---------------------------------------------------------------------------
  // রেসপন্সের শেষ বাইট ব্রাউজারের উদ্দেশ্যে পাঠানো হলে এই ইভেন্ট স্বয়ংক্রিয়ভাবে চলবে
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    console.log(`[LIFECYCLE LOG] ${req.method} ${req.url} -> Status: ${res.statusCode} | Duration: ${durationMs}ms`);
  });

  // ---------------------------------------------------------------------------
  // ধাপ ৪: হেডার সেট করা ও JSON রেসপন্স পাঠানো
  // ---------------------------------------------------------------------------
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url === '/') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      message: 'HTTP lifecycle server is active and running',
      status: 'success'
    }));
  }

  // পেজ না পেলে ৪০৪ ফলব্যাক
  res.statusCode = 404;
  return res.end(JSON.stringify({
    error: 'Not Found',
    message: `Path '${req.url}' was not found on this server`
  }));
});

// -----------------------------------------------------------------------------
// ধাপ ৫: সার্ভার ৩০০০ পোর্টে চালু করা
// -----------------------------------------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Server listening on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/ in your browser to inspect terminal lifecycle logs.`);
});
