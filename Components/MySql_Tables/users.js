const db = require("../db");

module.exports.CREATE_USER = req => {
  db.prepare(
    "INSERT INTO users (username, password, theaters_number) VALUES (?, ?, ?)"
  ).run(req.username, req.password, req.theaters_number);
};

module.exports.SELECTION_USERS = () => {
  return Promise.resolve(
    db
      .prepare('SELECT username AS "value", username AS "label", id AS "key" FROM users')
      .all()
  );
};

module.exports.LOGIN = req => {
  const user = req.query.theater_name;
  const password = req.query.password;

  if (user == undefined) {
    return Promise.resolve({ bol: "user" });
  } else if (password == undefined) {
    return Promise.resolve({ bol: "password" });
  }

  const result = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .all(user);

  if (!result[0]) {
    return Promise.resolve({ bol: false });
  } else if (password === result[0].password) {
    return Promise.resolve({
      bol: true,
      theaters_number: result[0].theaters_number
    });
  } else {
    return Promise.resolve({ bol: false });
  }
};

module.exports.ALL_USERS = () => {
  return Promise.resolve(
    db.prepare("SELECT username FROM users").all()
  );
};
