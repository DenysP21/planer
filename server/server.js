const http = require("http");
const fs = require("fs");
const path = require("path");
const handleAuthRoutes = require("./routes/authRoutes");

const CONTENT_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json",
};

const server = http.createServer(async (req, res) => {
  try {
    if (
      req.method === "GET" &&
      (req.url.startsWith("/img/") ||
        req.url.startsWith("/css/") ||
        req.url.startsWith("/js/"))
    ) {
      const filePath = path.join(__dirname, "..", "public", req.url);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = CONTENT_TYPES[ext] || "text/plain";

      await sendFile(res, filePath, contentType);
      return;
    }

    const isHandled = await handleAuthRoutes(req, res);
    if (isHandled) return;

    if (req.method === "GET") {
      let filePath;
      if (req.url === "/") {
        filePath = path.join(__dirname, "../public/index.html");
      } else if (req.url === "/planner.html") {
        filePath = path.join(__dirname, "../public/planner.html");
      } else {
        filePath = path.join(__dirname, "../public", req.url);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = CONTENT_TYPES[ext] || "text/html";

      await sendFile(res, filePath, contentType);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Маршрут не знайдено");
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Внутрішня помилка сервера");
    }
  }
});

async function sendFile(res, filePath, contentType) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    const data = await fs.promises.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    });
    res.end(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Файл не знайдено");
    } else {
      throw err;
    }
  }
}

server.listen(3000, () => {
  console.log("Сервер працює на http://localhost:3000");
});
