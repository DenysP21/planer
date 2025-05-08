const http = require("http");
const fs = require("fs");
const path = require("path");
const handleAuthRoutes = require("./routes/authRoutes");

const server = http.createServer((req, res) => {
  if (
    req.url.startsWith("/img/") ||
    req.url.startsWith("/css/") ||
    req.url.startsWith("/js/")
  ) {
    const filePath = path.join(__dirname, "..", "public", req.url);
    const ext = path.extname(filePath);
    let contentType = "text/plain";

    if (ext === ".png") contentType = "image/png";
    else if (ext === ".svg") contentType = "image/svg+xml";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".css") contentType = "text/css";
    else if (ext === ".js") contentType = "text/javascript";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
    return;
  }
  if (handleAuthRoutes(req, res)) return;

  let filePath;
  if (req.url === "/") {
    filePath = path.join(__dirname, "../public/index.html");
  } else if (req.url === "/planner.html") {
    filePath = path.join(__dirname, "../public/planner.html");
  } else {
    filePath = path.join(__dirname, "../public", req.url);
  }

  const ext = path.extname(filePath);
  let contentType = "text/html";
  if (ext === ".js") contentType = "text/javascript";
  else if (ext === ".css") contentType = "text/css";

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Файл не знайдено");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Помилка сервера");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Сервер працює на http://localhost:3000");
});
