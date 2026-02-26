const db = require("../db");

module.exports.GET_ALL_UPDATES = req => {
  return Promise.resolve(
    db
      .prepare("SELECT * FROM updates WHERE username = ? AND date = ?")
      .all(req.username, req.date)
  );
};

module.exports.DAILY_UPDATES = req => {
  const records = db
    .prepare(
      "SELECT * FROM updates_name_record WHERE username = ? AND date = ?"
    )
    .all(req.username, req.date);

  let user = {};
  for (let item of records) {
    user = item.name;
  }

  db.prepare(
    `INSERT INTO updates
     (type, username, projectionist, date, time, title, t_number, t_temp, p_temp, notes, sound, picture, lights, focus, poster, starting_time, additional_notes, fixed, active_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.type, req.username, user, req.date, req.time,
    req.title, req.theater, req.theater_temp, req.proj_temp,
    req.notes, req.sound, req.picture, req.lights, req.focus,
    req.poster, req.starts, req.additional_notes, req.fixed, req.active_key
  );
  return Promise.resolve();
};

module.exports.GET_ALL_DAILY_UPDATES = req => {
  return Promise.resolve(
    db
      .prepare(
        "SELECT * FROM updates WHERE username = ? AND date = ? AND type = '1'"
      )
      .all(req.username, req.date)
  );
};

module.exports.UNREG_UPDATES = req => {
  const records = db
    .prepare(
      "SELECT * FROM updates_name_record WHERE username = ? AND date = ?"
    )
    .all(req.username, req.date);

  let user = {};
  for (let item of records) {
    user = item.name;
  }

  db.prepare(
    `INSERT INTO updates (type, username, projectionist, date, time, title, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.type, req.username, user, req.date, req.time, req.title, req.notes);
  return Promise.resolve();
};
