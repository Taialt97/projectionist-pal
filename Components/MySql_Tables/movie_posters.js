const db = require("../db");

module.exports.GET_MOVIE_POSTER = () => {
  return Promise.resolve(
    db.prepare("SELECT * FROM movie_posters").all()
  );
};

module.exports.NEW_POSTER = req => {
  const file = req.file.filename;
  const name = req.body.movieTitle;
  db.prepare("INSERT INTO movie_posters (poster, title) VALUES (?, ?)").run(
    file, name
  );
  return Promise.resolve();
};
