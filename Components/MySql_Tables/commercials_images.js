const db = require("../db");

module.exports.GET_LAST_COMMERCIALS_IMAGE = req => {
  const rows = db
    .prepare(
      "SELECT * FROM commercials_images WHERE username = ? ORDER BY id DESC LIMIT 1"
    )
    .all(req.username);

  for (const row of rows) {
    if (row.updated) {
      row.updated = new Date(row.updated);
    }
  }
  return Promise.resolve(rows);
};

module.exports.NEW_COMMERCIALS_IMAGE = req => {
  db.prepare(
    "INSERT INTO commercials_images (username, image) VALUES (?, ?)"
  ).run(req.body.username, req.file.filename);
  return Promise.resolve();
};
