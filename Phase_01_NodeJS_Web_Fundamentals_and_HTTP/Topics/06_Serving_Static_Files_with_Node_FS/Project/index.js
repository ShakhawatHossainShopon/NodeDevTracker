import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000;

// বর্তমান ফাইলের ডিরেক্টরি এবং 'public' ফোল্ডারের অ্যাবসোলিউট পাথ নির্ধারণ
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, 'public');

// বিভিন্ন এক্সটেনশনের জন্য সঠিক MIME Type ডিকশনারি
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`\n--- [STATIC REQUEST] ${req.method} ${req.url} ---`);

  // ১. রুট পাথ '/' হলে ডিফল্টভাবে index.html ধরব
  const requestPath = req.url === '/' ? '/index.html' : req.url;

  // ২. পাথ নরমালাইজ করা এবং ডিরেক্টরি ট্রাভার্সাল (../../) প্রতিরোধ করা
  const safeRelativePath = path.normalize(requestPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safeRelativePath);

  // ৩. সিকিউরিটি চেক: ফাইলটি সত্যিই PUBLIC_DIR এর ভেতরে আছে কি না
  if (!filePath.startsWith(PUBLIC_DIR)) {
    console.log(`[SECURITY BLOCKED] Directory Traversal attempt: "${req.url}"`);
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('403 Forbidden: Access Denied');
  }

  // ৪. ফাইলটি ডিস্কে আছে কি না তা fs.stat দিয়ে চেক করা
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`[FILE 404] File not found on disk: "${safeRelativePath}"`);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 3rem;">
          <h1>404 - File Not Found</h1>
          <p>Requested file <code>${requestPath}</code> does not exist.</p>
        </div>
      `);
    }

    // ৫. এক্সটেনশন অনুযায়ী MIME Type নির্বাচন
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    console.log(`[FILE FOUND] ${safeRelativePath} (Size: ${stats.size} bytes)`);
    console.log(`[HEADER SET] Content-Type: ${contentType}`);

    // রেসপন্স হেডার সেট করা
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);

    // ৬. fs.createReadStream().pipe(res) দিয়ে মেমোরি-সাশ্রয়ী স্ট্রিমিং
    console.log(`[STREAMING] Piping file stream directly to network socket...`);
    const fileStream = fs.createReadStream(filePath);

    // স্ট্রিমে কোনো ত্রুটি ঘটলে হ্যান্ডল করা
    fileStream.on('error', (streamErr) => {
      console.log(`[STREAM ERROR] ${streamErr.message}`);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('500 Internal Server Error');
      }
    });

    fileStream.on('end', () => {
      console.log(`[STREAM COMPLETED] Successfully delivered: ${safeRelativePath}`);
    });

    // ফাইল থেকে পড়ে সাথে সাথে রেসপন্সে পাইপ করে দেওয়া
    fileStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`[SERVER ACTIVE] Production-ready static server on http://localhost:${PORT}`);
  console.log(`[SERVING DIRECTORY] ${PUBLIC_DIR}`);
  console.log('='.repeat(60));
  console.log('Open http://localhost:3000 in your browser.');
});
