const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(";").forEach((cookie) => {
    let [name, ...rest] = cookie.split("=");
    name = name.trim();
    const value = rest.join("=").trim();
    if (!name || !value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

module.exports = {
  hashPassword,
  verifyPassword,
  parseCookies,
};
