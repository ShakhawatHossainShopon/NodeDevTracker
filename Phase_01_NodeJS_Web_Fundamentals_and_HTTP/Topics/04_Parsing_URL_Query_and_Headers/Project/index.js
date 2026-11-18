import http from "node:http";

const server = http.createServer((req, res) => {
  const startTime = Date.now();

  console.log("\n======================================");
  console.log("       1. INCOMING REQUEST");
  console.log("======================================");

  // Step 1: Request Information
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("HTTP Version:", req.httpVersion);

  // Step 2: Request Headers
  console.log("\n======================================");
  console.log("       2. REQUEST HEADERS");
  console.log("======================================");

  const authHeader = req.headers["authorization"];

  const safeHeaders = {
    ...req.headers,
    authorization: authHeader ? "[REDACTED]" : "none",
  };

  console.log("All Headers:", safeHeaders);
  console.log("Host:", req.headers.host);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Authorization Provided:", Boolean(authHeader));

  // Step 3: URL Parsing
  console.log("\n======================================");
  console.log("       3. URL PARSING");
  console.log("======================================");

  const host = req.headers.host || "localhost:3000";

  const parsedUrl = new URL(
    req.url,
    `http://${host}`
  );

  console.log("Full URL:", parsedUrl.href);
  console.log("Protocol:", parsedUrl.protocol);
  console.log("Hostname:", parsedUrl.hostname);
  console.log("Port:", parsedUrl.port);
  console.log("Pathname:", parsedUrl.pathname);
  console.log("Search:", parsedUrl.search);

  // Step 4: Query Parameters
  console.log("\n======================================");
  console.log("       4. QUERY PARAMETERS");
  console.log("======================================");

  const searchQuery = parsedUrl.searchParams.get("q") || "all";

  const rawLimit = parsedUrl.searchParams.get("limit") || "10";
  const parsedLimit = Number.parseInt(rawLimit, 10);

  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0
    ? parsedLimit
    : 10;

  console.log("All Query Parameters:");

  console.table(
    Array.from(parsedUrl.searchParams.entries()).map(([key, value]) => ({
      key,
      value,
    }))
  );

  console.log("Search Query:", searchQuery);
  console.log("Raw Limit:", rawLimit);
  console.log("Parsed Limit:", limit);

  // Step 5: Response Header
  console.log("\n======================================");
  console.log("       5. RESPONSE HEADERS");
  console.log("======================================");

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  console.log("Content-Type:", res.getHeader("Content-Type"));
  console.log("All Response Headers:", res.getHeaders());

  // Step 6: Routing
  console.log("\n======================================");
  console.log("       6. ROUTING");
  console.log("======================================");

  let responseData;

  if (parsedUrl.pathname === "/api/search") {
    console.log("Matched Route: /api/search");

    res.statusCode = 200;

    responseData = {
      status: "success",
      endpoint: parsedUrl.pathname,
      query: {
        q: searchQuery,
        limit,
      },
      clientHeaders: {
        authorizationProvided: Boolean(authHeader),
        host: req.headers.host,
      },
    };
  } else {
    console.log("No Route Matched!");

    res.statusCode = 404;

    responseData = {
      status: "error",
      message: `Route '${parsedUrl.pathname}' not found`,
    };
  }

  // Step 7: Prepare Response
  const responseBody = JSON.stringify(responseData, null, 2);

  console.log("\n======================================");
  console.log("       7. RESPONSE PREPARATION");
  console.log("======================================");

  console.log("Status Code:", res.statusCode);
  console.log("Response Body:");
  console.log(responseBody);

  // Step 8: Response Lifecycle Event
  res.on("finish", () => {
    console.log("\n======================================");
    console.log("       8. RESPONSE FINISHED");
    console.log("======================================");

    console.log("Status:", res.statusCode);
    console.log("Headers Sent:", res.headersSent);
    console.log("Writable Ended:", res.writableEnded);
    console.log("Duration:", Date.now() - startTime, "ms");

    console.log("Request Lifecycle Completed!");
    console.log("======================================\n");
  });

  // Step 9: Send Response
  console.log("\nSending Response to Client...");

  res.end(responseBody);
});

// Step 10: Start Server
const PORT = 3000;

server.listen(PORT, () => {
  console.log("\n======================================");
  console.log("[SERVER RUNNING]");
  console.log(`http://localhost:${PORT}`);
  console.log("======================================");

  console.log(
    `Test URL: http://localhost:${PORT}/api/search?q=laptop&limit=5`
  );
});