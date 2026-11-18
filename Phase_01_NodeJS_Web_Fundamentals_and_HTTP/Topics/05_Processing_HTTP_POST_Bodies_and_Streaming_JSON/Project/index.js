import http from 'node:http';

// -----------------------------------------------------------------------------
// ধাপ ১: http.createServer() দিয়ে সার্ভার তৈরি
// -----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  console.log(`\n[HTTP REQUEST] Method: ${req.method} | URL: ${req.url}`);

  // শুধুমাত্র POST মেথড এবং '/api/users' পাথে রিকোয়েস্ট ফিল্টার করা
  if (req.method !== 'POST' || req.url !== '/api/users') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    console.log('[ROUTE 404] Route not matched.');
    return res.end(JSON.stringify({ error: 'Route not found' }));
  }

  // ---------------------------------------------------------------------------
  // ধাপ ২: ইনকামিং ডাটা চাঙ্ক (Chunks) সংগ্রহ করা
  // ---------------------------------------------------------------------------
  const chunks = [];
  console.log('[STREAM START] Listening for incoming data chunks...');

  req.on('data', (chunk) => {
    chunks.push(chunk);
    console.log(`[CHUNK ARRIVED] Received ${chunk.length} bytes (Buffer chunk).`);
  });

  // ---------------------------------------------------------------------------
  // ধাপ ৩: স্ট্রিম শেষ হলে সব বাফার একত্র করা (Buffer.concat) এবং স্ট্রিংয়ে রূপান্তর
  // ---------------------------------------------------------------------------
  req.on('end', () => {
    console.log(`[STREAM END] Stream finished. Total chunks: ${chunks.length}`);

    // Buffer.concat() দিয়ে সব বাইনারি বাফার একসাথে মার্জ করে UTF-8 স্ট্রিং বানানো
    const rawBody = Buffer.concat(chunks).toString('utf-8');
    console.log(`[BUFFER CONCAT] Successfully merged chunks into raw text:`);
    console.log(`               "${rawBody}"`);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Step 3: Chunks merged into raw string successfully!',
      totalChunks: chunks.length,
      rawBodyReceived: rawBody
    }));
  });
});

// -----------------------------------------------------------------------------
// সার্ভার চালু করা
// -----------------------------------------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER ACTIVE] Server running on http://localhost:${PORT}`);
});
