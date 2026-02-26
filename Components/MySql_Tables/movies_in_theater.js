const db = require("../db");

module.exports.MOVIES_IN_THEATERS = req => {
  const theater = req.theater || req.theater_number;
  return Promise.resolve(
    db
      .prepare(
        `SELECT
          movies_in_theater.id,
          movies_in_theater.username,
          movies_in_theater.theater_number,
          movies_in_theater.movie_title,
          movies_in_theater.poster,
          movies_in_theater.tag,
          movie_info.key_exp,
          movie_info.key_exp_time
        FROM movies_in_theater
        LEFT JOIN movie_info
          ON movie_info.title = movies_in_theater.movie_title
          AND movie_info.username = movies_in_theater.username
        WHERE movies_in_theater.username = ?
          AND movies_in_theater.theater_number = ?`
      )
      .all(req.username, theater)
  );
};

module.exports.REMOVE_MOVIE_FROM_THEATER = req => {
  db.prepare("DELETE FROM movies_in_theater WHERE id = ?").run(req.id);
  return Promise.resolve();
};

module.exports.UPDATE_TAG_MOVIES_IN_THEATERS = req => {
  db.prepare("UPDATE movies_in_theater SET tag = ? WHERE id = ?").run(
    req.tag, req.id
  );
  return Promise.resolve();
};

module.exports.MOVIES_IN_THEATER = req => {
  db.prepare(
    "INSERT INTO movies_in_theater (poster, username, theater_number, movie_title, tag) VALUES (?, ?, ?, ?, ?)"
  ).run(req.poster, req.username, req.theater_number, req.movie_title, "in theater");

  db.prepare("DELETE FROM temp_movie_in_theater WHERE id = ?").run(req.id);
  return Promise.resolve();
};
