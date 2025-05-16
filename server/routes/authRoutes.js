const { createUser, findUserByEmail } = require("../db/userModel");
const { hashPassword, verifyPassword } = require("../utils/auth");

const registerHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
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
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

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
};

const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(JSON.parse(body)));
  });
};

const routes = {
  "POST /register": registerHandler,
  "POST /login": loginHandler,
};

async function handleAuthRoutes(req, res) {
  const routeKey = `${req.method} ${req.url}`;
  const handler = routes[routeKey];

  if (!handler) {
    if (req.method === "POST") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Маршрут не знайдено");
      return true;
    }
    return false;
  }

  try {
    if (req.method === "POST") {
      req.body = await parseBody(req);
    }
    await handler(req, res);
  } catch (error) {
    res.writeHead(500);
    res.end("Помилка сервера");
  }
  return true;
}

module.exports = handleAuthRoutes;
