import http from "node:http";

const usersDb = [
  {
    id: 1,
    name: "Rahim",
    email: "rahim@gmail.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Karim",
    email: "karim@gmail.com",
    role: "user",
  },
  {
    id: 3,
    name: "Hasan",
    email: "hasan@gmail.com",
    role: "user",
  },
];

const PORT = 3000;

const server = http.createServer((req, res) => {
  // ১. রিকোয়েস্ট শুরু হওয়ার সময় এবং লাইফসাইকেল লগার সবার শুরুতে সেট করা
  const startTime = Date.now();
  res.on("finish", () => {
    const latency = Date.now() - startTime;
    console.log(
      `[HTTP ${res.statusCode}] ${req.method} ${req.url} (${latency}ms)`,
    );
  });

  // ২. ইউআরএল এবং পাথনেম পার্স করা
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // ৩. এন্ডপয়েন্ট ১: GET /api/status
  if (req.method === "GET" && pathname === "/api/status") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }),
    );
  }

  // ৪. এন্ডপয়েন্ট ২: GET /api/users
  if (req.method === "GET" && pathname === "/api/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        status: "success",
        count: usersDb.length,
        data: usersDb,
      }),
    );
  }
  const userMatch = pathname.match(/^\/api\/users\/(\d+)$/);
  if (req.method === "GET" && userMatch) {
    const id = parseInt(userMatch[1], 10);
    const user = usersDb.find((u) => u.id === id);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        user,
      }),
    );
  }

  if (req.method === "GET" && pathname === "/api/search") {
    const query = url.searchParams.get("q") || "";
    const limit = Number(url.searchParams.get("limit")) || 10;
    const filtered = usersDb
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.role.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, limit);
    // ২. usersDb ফিল্টার করুন
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        status: "success",
        query: url.searchParams.get("q"),
        resultsCount: filtered.length,
        filtered,
      }),
    );
  }
  // ৫. ফলব্যাক (যদি কোনো রুটের সাথেই না মেলে)
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  return res.end(
    JSON.stringify({
      status: "error",
      message: "Route not defined",
    }),
  );
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
