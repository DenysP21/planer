const db = require("./dataBase");

function createUser(email, passwordHash, callback) {
  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(query, [email, passwordHash], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, this.lastID);
    }
  });
}

function findUserByEmail(email, callback) {
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, row) => {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

module.exports = {
  createUser,
  findUserByEmail,
};
