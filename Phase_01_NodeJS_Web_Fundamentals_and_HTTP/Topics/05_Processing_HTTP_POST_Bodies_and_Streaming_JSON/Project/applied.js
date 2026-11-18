import http from 'node:http';

const PORT = 3000;

// In-memory array to store users during server lifetime
const usersDatabase = [];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Separator for incoming request
  console.log('\n' + '='.repeat(72));
  console.log(`>>> [INCOMING HTTP REQUEST] ${req.method} ${req.url}`);
  console.log('='.repeat(72));
  console.log(`[HEADERS] Host: ${req.headers.host || 'unknown'} | Content-Type: ${req.headers['content-type'] || 'none'}`);

  // Route 1: GET /api/users (List all created users)
  if (req.method === 'GET' && req.url === '/api/users') {
    console.log('\n[ROUTING] Matched: GET /api/users');
    console.log(`[ACTION] Fetching all stored users. Current count: ${usersDatabase.length}`);
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'success',
      count: usersDatabase.length,
      data: usersDatabase
    }, null, 2));
  }

  // Route 2: POST /api/users (Process incoming JSON stream)
  if (req.method === 'POST' && req.url === '/api/users') {
    console.log('\n[ROUTING] Matched: POST /api/users');
    console.log('[STREAM STAGE 1: INIT] `req` is an active ReadableStream.');
    console.log('                       Data is not in memory yet. Registering "data" & "end" listeners...');

    const chunks = [];
    let receivedBytes = 0;

    // STAGE 2: Data chunks arrival
    req.on('data', (chunk) => {
      chunks.push(chunk);
      receivedBytes += chunk.length;
      console.log(`[STREAM STAGE 2: CHUNK] Received chunk #${chunks.length} -> ${chunk.length} bytes (Buffer) | Total so far: ${receivedBytes} bytes`);
    });

    // STAGE 3: Stream finished
    req.on('end', () => {
      console.log(`[STREAM STAGE 3: END] Client completed transmission. Total chunks: ${chunks.length} (${receivedBytes} bytes)`);

      // STAGE 4: Buffer Concatenation
      console.log('[BUFFER STAGE 4: CONCAT] Executing Buffer.concat(chunks).toString("utf-8")...');
      const rawBody = Buffer.concat(chunks).toString('utf-8');
      console.log(`[RAW PAYLOAD RECEIVED] Length: ${rawBody.length} chars`);
      console.log(`                       Payload preview: ${rawBody.slice(0, 80)}${rawBody.length > 80 ? '...' : ''}`);

      // STAGE 5: JSON Parsing
      console.log('[JSON STAGE 5: PARSING] Passing string into JSON.parse()...');
      try {
        const body = JSON.parse(rawBody || '{}');
        console.log('[JSON STAGE 5: SUCCESS] JavaScript Object successfully parsed:');
        console.dir(body, { depth: null, colors: true });

        // STAGE 6: Validation
        console.log('[VALIDATION STAGE 6] Checking required fields (name, email)...');
        if (!body.name || !body.email) {
          console.log('[VALIDATION FAILED] Missing required fields!');
          console.log('                     Expected: { "name": "...", "email": "..." }');
          console.log('                     -> Sending HTTP 400 Bad Request');

          res.statusCode = 400;
          return res.end(JSON.stringify({
            status: 'error',
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation failed: Fields "name" and "email" are required.'
          }, null, 2));
        }

        console.log('[VALIDATION PASSED] All required fields are present.');

        // STAGE 7: Business Logic & Persistence
        const newUser = {
          id: usersDatabase.length + 1,
          name: body.name,
          email: body.email,
          createdAt: new Date().toISOString()
        };
        usersDatabase.push(newUser);
        console.log(`[DATABASE] Saved new user with ID: ${newUser.id}. Total users in memory: ${usersDatabase.length}`);

        // STAGE 8: Response Sending
        console.log('[RESPONSE STAGE 8] Sending HTTP 201 Created with JSON envelope.');
        res.statusCode = 201;
        return res.end(JSON.stringify({
          status: 'success',
          statusCode: 201,
          message: 'User created successfully via streaming JSON payload',
          data: newUser
        }, null, 2));

      } catch (err) {
        console.log(`[JSON PARSE ERROR] Malformed JSON received! SyntaxError: "${err.message}"`);
        console.log('                   -> Sending HTTP 400 Bad Request to client.');

        res.statusCode = 400;
        return res.end(JSON.stringify({
          status: 'error',
          statusCode: 400,
          error: 'Bad Request',
          message: 'Malformed JSON payload. Please ensure valid JSON syntax.',
          details: err.message
        }, null, 2));
      }
    });

    return;
  }

  // 404 Route Fallback
  console.log(`[ROUTER 404] No matching route found for ${req.method} ${req.url}`);
  console.log('             -> Sending HTTP 404 Not Found');
  res.statusCode = 404;
  return res.end(JSON.stringify({
    status: 'error',
    statusCode: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}. Available: GET /api/users, POST /api/users`
  }, null, 2));
});

server.listen(PORT, () => {
  console.log('\n' + '#'.repeat(74));
  console.log('#  🎓 TOPIC 05: HTTP POST & STREAMING JSON — TERMINAL CLASSROOM LAB      #');
  console.log('#'.repeat(74));
  console.log(`\n[SERVER STATUS] Active & Listening on http://localhost:${PORT}`);
  console.log('[LEARNING MODE] Terminal Tracing Active. Every step is explained live.\n');

  console.log('--------------------------------------------------------------------------');
  console.log('👉 COPY & PASTE THESE COMMANDS IN A SECOND POWERSHELL / TERMINAL TO TEST:');
  console.log('--------------------------------------------------------------------------\n');

  console.log('[TEST 1: CREATE VALID USER (201 Created)]');
  console.log(`Invoke-RestMethod -Uri "http://localhost:${PORT}/api/users" -Method Post -ContentType "application/json" -Body '{"name":"Rahim Ahmed", "email":"rahim@example.com"}'\n`);

  console.log('[TEST 2: GET ALL USERS (200 OK)]');
  console.log(`Invoke-RestMethod -Uri "http://localhost:${PORT}/api/users" -Method Get\n`);

  console.log('[TEST 3: VALIDATION FAILURE (400 Bad Request)]');
  console.log(`Invoke-RestMethod -Uri "http://localhost:${PORT}/api/users" -Method Post -ContentType "application/json" -Body '{"name":"Only Name Without Email"}'\n`);

  console.log('[TEST 4: BROKEN JSON SYNTAX (400 Bad Request Catch)]');
  console.log(`Invoke-RestMethod -Uri "http://localhost:${PORT}/api/users" -Method Post -ContentType "application/json" -Body '{"name": "Broken JSON missing bracket'\n`);

  console.log('[TEST 5: UNKNOWN ROUTE (404 Not Found)]');
  console.log(`Invoke-RestMethod -Uri "http://localhost:${PORT}/api/random-page" -Method Get\n`);

  console.log('--------------------------------------------------------------------------');
  console.log('Server is waiting for your test commands... Watch this terminal for logs!');
  console.log('--------------------------------------------------------------------------\n');
});
