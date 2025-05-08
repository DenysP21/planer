const { createUser, findUserByEmail } = require("../db/userModel");
const { hashPassword, verifyPassword } = require("../utils/auth");

// Обробка запитів
function handleAuthRoutes(req, res) {
  if (req.method === "POST" && req.url === "/register") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { email, password } = JSON.parse(body);
      try {
        const passwordHash = await hashPassword(password);
        createUser(email, passwordHash, (err, userId) => {
          if (err) {
            res.writeHead(400);
            res.end("Користувач вже існує або інша помилка");
          } else {
            res.writeHead(200, {
              "Set-Cookie": `userId=${userId}; Path=/; HttpOnly`,
            });
            res.end("Успішна реєстрація");
          }
        });
      } catch (e) {
        res.writeHead(500);
        res.end("Помилка сервера");
      }
    });
  } else if (req.method === "POST" && req.url === "/login") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { email, password } = JSON.parse(body);
      findUserByEmail(email, async (err, user) => {
        if (err || !user) {
          res.writeHead(401);
          res.end("Користувача не знайдено");
        } else {
          const isMatch = await verifyPassword(password, user.password);
          if (isMatch) {
            res.writeHead(200, {
              "Set-Cookie": `userId=${user.id}; Path=/; HttpOnly`,
            });
            res.end("Вхід успішний");
          } else {
            res.writeHead(401);
            res.end("Невірний пароль");
          }
        }
      });
    });
  } else {
    return false;
  }
  return true;
}

module.exports = handleAuthRoutes;
