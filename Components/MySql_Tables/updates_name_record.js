const db = require("../db");

module.exports.ADD_NAME_TO_UPDATE_RECORD = req => {
  db.prepare(
    "INSERT INTO updates_name_record (username, name, date, time) VALUES (?, ?, ?, ?)"
  ).run(req.username, req.name, req.date, req.time);
  return Promise.resolve();
};

module.exports.GET_NAMES = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM updates_name_record WHERE date = ? AND username = ?"
      )
      .all(req.date, req.username)
  );
};
