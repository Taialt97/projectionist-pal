const db = require("../db");

module.exports.TEMP_MOVIES_IN_THEATERS = req => {
  db.prepare(
    "INSERT INTO temp_movie_in_theater (poster, username, theater_number, movie_title) VALUES (?, ?, ?, ?)"
  ).run(req.poster, req.username, req.theater_number, req.movie_title);
  return Promise.resolve();
};

module.exports.TEMP_THEATER = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM temp_movie_in_theater WHERE username = ? AND theater_number = ?"
      )
      .all(req.username, req.theater_number)
  );
};
