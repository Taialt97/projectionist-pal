const db = require("../db");

module.exports.GET_NEXT_WEEK = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM next_week WHERE username = ? AND theater_number = ?"
      )
      .all(req.username, req.theater_number)
  );
};

module.exports.ADD_TO_NEXT_WEEK = req => {
  db.prepare(
    "INSERT INTO next_week (username, theater_number, movie_title, poster) VALUES (?, ?, ?, ?)"
  ).run(req.username, req.theater_number, req.movie_title, req.poster);
  return Promise.resolve();
};

module.exports.REMOVE_NEXT_WEEK = req => {
  db.prepare("DELETE FROM next_week WHERE id = ?").run(req.id);
  return Promise.resolve();
};
