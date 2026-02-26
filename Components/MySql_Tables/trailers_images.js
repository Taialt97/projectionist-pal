const db = require("../db");

module.exports.GET_LAST_TRAILER_IMAGE = req => {
  const rows = db
    .prepare(
      "SELECT * FROM trailers_images WHERE username = ? ORDER BY id DESC LIMIT 1"
    )
    .all(req.username);

  for (const row of rows) {
    if (row.updated) {
      row.updated = new Date(row.updated);
    }
  }
  return Promise.resolve(rows);
};

module.exports.NEW_TRAILER_IMAGE = req => {
  db.prepare(
    "INSERT INTO trailers_images (username, image) VALUES (?, ?)"
  ).run(req.body.username, req.file.filename);
  return Promise.resolve();
};
