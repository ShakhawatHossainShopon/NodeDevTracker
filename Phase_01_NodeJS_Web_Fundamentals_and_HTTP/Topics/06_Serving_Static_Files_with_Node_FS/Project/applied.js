import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, 'public');

// MIME types dictionary mapping file extensions to Content-Type headers
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

  // Step 1: Default to index.html if root path requested
  const requestPath = req.url === '/' ? '/index.html' : req.url;

  // Step 2: Normalize and resolve absolute system path
  const safeRelativePath = path.normalize(requestPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safeRelativePath);

  // Step 3: Security Guard — Prevent Directory Traversal Attacks (e.g., ../../package.json)
  if (!filePath.startsWith(PUBLIC_DIR)) {
    console.log(`[SECURITY ALERT] Directory Traversal attempt blocked: "${req.url}"`);
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('403 Forbidden: Access denied.');
  }

  // Step 4: Check if file exists on disk
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`[FILE 404] File not found: "${safeRelativePath}"`);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(`
        <div style="font-family:sans-serif; text-align:center; padding:3rem;">
          <h1>404 - Static File Not Found</h1>
          <p>The requested asset <code>${requestPath}</code> does not exist in <code>public/</code>.</p>
        </div>
      `);
    }

    // Step 5: Lookup appropriate MIME type from file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    console.log(`[FILE FOUND] ${safeRelativePath} (${stats.size} bytes)`);
    console.log(`[HEADER SET] Content-Type: ${contentType}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);

    // Step 6: Stream file directly to client response using fs.createReadStream().pipe(res)
    console.log('[STREAM PIPING] Streaming file directly from disk to network response...');
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (streamErr) => {
      console.log(`[STREAM ERROR] ${streamErr.message}`);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('500 Internal Server Error');
      }
    });

    fileStream.on('end', () => {
      console.log(`[STREAM COMPLETED] Finished streaming ${safeRelativePath} to client.`);
    });

    fileStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('\n' + '#'.repeat(74));
  console.log('#  🚀 TOPIC 06: NATIVE STATIC FILE SERVER (HTML, CSS, JS) — CLASSROOM    #');
  console.log('#'.repeat(74));
  console.log(`\n[SERVER STATUS] Active & Listening on http://localhost:${PORT}`);
  console.log(`[ROOT DIRECTORY] Serving assets from: ${PUBLIC_DIR}\n`);

  console.log('--------------------------------------------------------------------------');
  console.log('👉 TEST URLS (OPEN IN BROWSER OR RUN IN POWERSHELL):');
  console.log('--------------------------------------------------------------------------\n');

  console.log('[TEST 1: OPEN FULL WEB PAGE IN BROWSER (HTML + CSS + JS)]');
  console.log(`👉 http://localhost:${PORT}/\n`);

  console.log('[TEST 2: DIRECT ASSET ACCESS (CSS ONLY)]');
  console.log(`👉 http://localhost:${PORT}/style.css\n`);

  console.log('[TEST 3: DIRECT ASSET ACCESS (JS ONLY)]');
  console.log(`👉 http://localhost:${PORT}/app.js\n`);

  console.log('[TEST 4: MISSING FILE (404 NOT FOUND)]');
  console.log(`👉 http://localhost:${PORT}/non-existent.png\n`);

  console.log('--------------------------------------------------------------------------');
  console.log('Open http://localhost:3000 in your browser and watch static file delivery logs!');
  console.log('--------------------------------------------------------------------------\n');
});
