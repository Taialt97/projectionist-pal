const db = require("../db");

function getall(req) {
  return db
    .prepare("SELECT * FROM phones_passwords WHERE username = ?")
    .all(req.username);
}

module.exports.REMOVE_PNP = req => {
  db.prepare("DELETE FROM phones_passwords WHERE id = ?").run(req.id);
  return Promise.resolve(getall(req));
};

module.exports.ADD_PNP = req => {
  db.prepare(
    "INSERT INTO phones_passwords (name, username, password, role, tag) VALUES (?, ?, ?, ?, ?)"
  ).run(req.name, req.username, req.password, req.role, req.tag);
  return Promise.resolve(getall(req));
};

module.exports.ALL_PNP = req => {
  return Promise.resolve(getall(req));
};
