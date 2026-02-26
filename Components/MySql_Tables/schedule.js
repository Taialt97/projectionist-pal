const db = require("../db");

module.exports.GET_TODAY_SCHEDULE = req => {
  return Promise.resolve(
    db
      .prepare(
        `SELECT
          s.id, s.username, s.date, s.poster, s.title, s.theater,
          s.starts, s.brake, s.end, u.type
        FROM schedule s
        LEFT JOIN updates u ON s.id = u.active_key
        WHERE s.date = ? AND s.username = ?
        GROUP BY s.id`
      )
      .all(req.date, req.username)
  );
};

module.exports.REMOVE_SCHEDULE_CREATE_NEW = req => {
  db.prepare(
    "DELETE FROM updates WHERE date = ? AND username = ? AND type = '2'"
  ).run(req.date, req.username);

  db.prepare(
    "DELETE FROM schedule WHERE date = ? AND username = ?"
  ).run(req.date, req.username);

  return Promise.resolve([]);
};

module.exports.NEW_SCHEDULE_ROW = req => {
  db.prepare(
    `INSERT INTO schedule (username, date, poster, title, theater, starts, brake, end)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.username, req.date, req.poster, req.title,
    req.theater, req.starts, req.brake, req.end
  );
};
