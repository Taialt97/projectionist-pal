const db = require("../db");

module.exports.GET_MOVIE_TRAILERS = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM movie_trailer WHERE username = ? AND movie_title = ? ORDER BY position"
      )
      .all(req.username, req.title)
  );
};

module.exports.REMOVE_MOVIE_TRAILERS = req => {
  db.prepare("DELETE FROM movie_trailer WHERE id = ?").run(req.id);

  const rows = db
    .prepare(
      "SELECT * FROM movie_trailer WHERE username = ? AND movie_title = ?"
    )
    .all(req.username, req.movie_title);

  const data = [];
  rows.forEach((item, i) => {
    db.prepare("UPDATE movie_trailer SET position = ? WHERE id = ?").run(i, item.id);
    data.push({
      id: item.id,
      trailer: item.trailer,
      movie_title: item.movie_title,
      username: item.username,
      position: i
    });
  });

  return Promise.resolve(data);
};

module.exports.UPLOAD_MOVIE_TRAILER = req => {
  db.prepare(
    "INSERT INTO movie_trailer (username, movie_title, trailer, position) VALUES (?, ?, ?, ?)"
  ).run(req.username, req.movie_title, req.trailer, req.position);
};
