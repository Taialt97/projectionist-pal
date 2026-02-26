const db = require("../db");

module.exports.GET_LAST_UPDATED_COMMERCIALS = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM commercials WHERE username = ? ORDER BY id DESC LIMIT 1"
      )
      .all(req.username)
  );
};

module.exports.GET_UPDATED_COMMERCIALS_WITH_COMMERCIALS_LIST = (req, date) => {
  let date_send;
  if (date !== undefined && date[0]) {
    let d = new Date(date[0].updated);
    date_send = String(
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    );
  } else {
    date_send = req.date;
  }

  return Promise.resolve(
    db
      .prepare(
        `SELECT
          sid.id,
          ss.status,
          sp.projectionist,
          s.type
        FROM commercials_types s
        LEFT JOIN commercials sid ON s.type = sid.title AND sid.date = ?
        LEFT JOIN commercials ss ON s.type = ss.title AND ss.date = ?
        LEFT JOIN commercials sp ON s.type = sp.title AND sp.date = ?`
      )
      .all(date_send, date_send, date_send)
  );
};

module.exports.UPDATE_COMMERCIALS = (req, proj) => {
  for (let item of req.selected) {
    if (item.id) {
      db.prepare("DELETE FROM commercials WHERE id = ?").run(item.id);
    } else {
      db.prepare(
        "INSERT INTO commercials (username, date, status, title, projectionist) VALUES (?, ?, ?, ?, ?)"
      ).run(req.username, req.date, "1", item.type, proj[0].name);
    }
  }
  return Promise.resolve();
};

module.exports.GET_PROJECTIONIST = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM updates_name_record WHERE username = ? AND date = ? ORDER BY id DESC LIMIT 1"
      )
      .all(req.username, req.date)
  );
};

module.exports.REMOVE_COMMERCIALS = req => {
  db.prepare(
    "DELETE FROM commercials WHERE date = ? AND username = ?"
  ).run(req[0].date, req[0].username);
  return Promise.resolve();
};
