import http from "node:http";

const server = http.createServer((req, res) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    console.log(
      `[LIFECYCLE LOG] ${req.method} ${req.url} -> Status: ${res.statusCode} | Duration: ${durationMs}ms`,
    );
  });

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.url === "/") {
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        message: "HTTP lifecycle server is active and running",
        status: "success",
      }),
    );
  }

  // পেজ না পেলে ৪০৪ ফলব্যাক
  res.statusCode = 404;
  return res.end(
    JSON.stringify({
      error: "Not Found",
      message: `Path '${req.url}' was not found`,
    }),
  );
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Server listening on http://localhost:${PORT}`);
  console.log(
    `Open http://localhost:${PORT}/ in your browser to inspect lifecycle logs.`,
  );
});
