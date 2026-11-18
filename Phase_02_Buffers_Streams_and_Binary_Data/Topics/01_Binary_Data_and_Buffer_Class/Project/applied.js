/**
 * Phase 02: Buffers, Streams & Binary Data in Web Applications
 * Topic 01: Binary Data in Web Backends & The Node.js Buffer Class
 * 
 * =============================================================================
 * Reference Implementation (applied.js)
 * Run Command: node applied.js (or npm run applied)
 * =============================================================================
 */

import http from 'node:http';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';

// 1x1 Transparent PNG binary data encoded in Base64
const PIXEL_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const PIXEL_BUFFER = Buffer.from(PIXEL_PNG_BASE64, 'base64');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // Route 1: Binary & Buffer Inspector
  if (req.method === 'GET' && pathname === '/api/buffer-inspect') {
    const text = parsedUrl.searchParams.get('text') || 'Node.js বাংলা';
    const textBuf = Buffer.from(text, 'utf-8');

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      input: text,
      stringLength: text.length,
      byteLength: Buffer.byteLength(text, 'utf-8'),
      bufferSize: textBuf.length,
      hexRepresentation: textBuf.toString('hex'),
      base64Representation: textBuf.toString('base64'),
      rawBytesArray: Array.from(textBuf)
    }, null, 2));
  }

  // Route 2: HTTP Basic Auth Header Decoder
  if (req.method === 'GET' && pathname === '/api/auth-decode') {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.writeHead(401, {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Basic realm="NodeSecure"'
      });
      return res.end(JSON.stringify({
        error: 'Unauthorized',
        hint: 'Send Authorization: Basic <base64(username:password)>'
      }));
    }

    const base64Credentials = authHeader.slice(6).trim();
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = decodedCredentials.split(':');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: 'Authentication header decoded successfully',
      rawHeader: authHeader,
      decodedString: decodedCredentials,
      credentials: { username, password }
    }));
  }

  // Route 3: Serving a Raw Binary Image Buffer
  if (req.method === 'GET' && pathname === '/api/pixel.png') {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': PIXEL_BUFFER.length,
      'Cache-Control': 'no-cache'
    });
    return res.end(PIXEL_BUFFER);
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({
    error: 'Not Found',
    availableRoutes: ['/api/buffer-inspect?text=Hello', '/api/auth-decode', '/api/pixel.png']
  }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Buffer Web Server listening on http://localhost:${PORT}`);
  console.log(`- Inspect Buffer: http://localhost:${PORT}/api/buffer-inspect?text=Node.js%20বাংলা`);
  console.log(`- Serve Binary PNG: http://localhost:${PORT}/api/pixel.png`);
  console.log(`- Decode Basic Auth: http://localhost:${PORT}/api/auth-decode (Headers needed)`);
});
