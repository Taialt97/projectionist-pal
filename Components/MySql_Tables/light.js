const db = require("../db");

module.exports.GET_LIGHT_INFO = req => {
  return Promise.resolve(
    db
      .prepare("SELECT * FROM light WHERE username = ? AND theater_number = ?")
      .all(req.username, req.theater)
  );
};

module.exports.UPDATE_LIGHT = req => {
  if (req.id === 0) {
    db.prepare(
      `INSERT INTO light (username, type, serial, max_light, light_on, reason, exploitation, theater_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      req.username, req.type, req.serial, req.max_light,
      req.light_on, req.reason, req.exploitation, req.theater_number
    );
  } else {
    db.prepare(
      `UPDATE light SET username=?, type=?, serial=?, max_light=?, light_on=?, reason=?, exploitation=?, theater_number=?
       WHERE id=?`
    ).run(
      req.username, req.type, req.serial, req.max_light,
      req.light_on, req.reason, req.exploitation, req.theater_number,
      req.id
    );
  }
  return Promise.resolve();
};
