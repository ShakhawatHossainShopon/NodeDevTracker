/**
 * ফেজ ০১: Node.js ওয়েব ফান্ডামেন্টালস ও নেটিভ HTTP
 * টপিক ০১: আধুনিক Node.js ওয়েব ল্যান্ডস্কেপ ও নেটিভ HTTP আর্কিটেকচার
 *
 * 🎯 প্রজেক্ট: সিম্পল নেটিভ HTTP সার্ভার ও JSON রেসপন্স
 * নির্দেশিকা: নিচের ছোট ধাপগুলো দেখে কোড লিখুন।
 * সম্পূর্ণ কোড দেখতে 'applied.js' ওপেন করুন।
 *
 * রান করার কমান্ড: node index.js
 */

import http from "node:http";

// -----------------------------------------------------------------------------
// ধাপ ১: http.createServer() দিয়ে সার্ভার তৈরি করুন
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        message: "Node.js নেটিভ HTTP সার্ভারে স্বাগতম!",
        status: "success",
      }),
    );
  }
  res.statusCode = 404;
  return res.end(
    JSON.stringify({
      error: "Not Found",
      message: `পাথ '${req.url}' খুঁজে পাওয়া যায়নি!`,
    }),
  );
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 সার্ভার চালু হয়েছে: http://localhost:${PORT}`);
  console.log(`টেস্ট করুন: http://localhost:${PORT}/api/status`);
});
