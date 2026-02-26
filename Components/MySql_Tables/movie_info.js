const db = require("../db");

module.exports.ALL_MOVIES = req => {
  return Promise.resolve(
    db.prepare("SELECT * FROM movie_info WHERE username = ?").all(req.username)
  );
};

module.exports.ALL_MOVIES_TITLES = req => {
  return Promise.resolve(
    db
      .prepare(
        `SELECT id AS "value", title AS "label", intermission, light_on
         FROM movie_info WHERE username = ?`
      )
      .all(req.username)
  );
};

module.exports.NEW_MOVIE_INFO = req => {
  db.prepare(
    `INSERT INTO movie_info
     (storage, rec_date, username, title, lang, sub_title, lens, format, key_exp, key_exp_time, intermission, light_on, after)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.storage, req.rec_date, req.username, req.title, req.lang,
    req.sub_title, req.lens, req.format, req.key_exp, req.key_exp_time,
    req.intermission, req.light_on, req.after
  );
  return Promise.resolve();
};

module.exports.UPDATE_KEY_ALL_MOVIES = req => {
  db.prepare(
    "UPDATE movie_info SET key_exp = ?, key_exp_time = ? WHERE id = ?"
  ).run(req.form.date, req.form.time, req.item.id);
  return Promise.resolve();
};

module.exports.UPDATE_STORAGE = req => {
  db.prepare("UPDATE movie_info SET storage = ? WHERE id = ?").run(
    req.storage, req.id
  );
  return Promise.resolve();
};

module.exports.REMOVE_MOVIE = req => {
  db.prepare("DELETE FROM movie_info WHERE id = ?").run(req.id);
  return Promise.resolve();
};
