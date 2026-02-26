const db = require("../db");

module.exports.GET_LAST_UPDATED_TRAILER = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM trailers WHERE username = ? ORDER BY id DESC LIMIT 1"
      )
      .all(req.username)
  );
};

module.exports.GET_UPDATED_TRAILERS_WITH_MOVIE_LIST = (req, date) => {
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
          tid.id,
          ts.status,
          tp.projectionist,
          mi.title
        FROM movie_info mi
        LEFT JOIN trailers tid ON mi.title = tid.title AND tid.date = ?
        LEFT JOIN trailers ts ON mi.title = ts.title AND ts.date = ?
        LEFT JOIN trailers tp ON mi.title = tp.title AND tp.date = ?
        WHERE mi.username = ?`
      )
      .all(date_send, date_send, date_send, req.username)
  );
};

module.exports.UPDATE_TRAILERS = (req, proj) => {
  for (let item of req.selected) {
    if (item.id) {
      db.prepare("DELETE FROM trailers WHERE id = ?").run(item.id);
    } else {
      db.prepare(
        "INSERT INTO trailers (username, date, status, title, projectionist) VALUES (?, ?, ?, ?, ?)"
      ).run(req.username, req.date, "1", item.title, proj[0].name);
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

module.exports.REMOVE_TRAILERS = req => {
  db.prepare(
    "DELETE FROM trailers WHERE date = ? AND username = ?"
  ).run(req[0].date, req[0].username);
  return Promise.resolve();
};
