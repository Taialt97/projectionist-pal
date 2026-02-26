const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "projectionist.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    theaters_number INTEGER
  );

  CREATE TABLE IF NOT EXISTS light (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    type TEXT,
    serial TEXT,
    max_light TEXT,
    light_on TEXT,
    reason TEXT,
    exploitation TEXT,
    theater_number TEXT
  );

  CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    date TEXT,
    poster TEXT,
    title TEXT,
    theater TEXT,
    starts TEXT,
    brake TEXT,
    end TEXT
  );

  CREATE TABLE IF NOT EXISTS movie_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storage TEXT,
    rec_date TEXT,
    username TEXT,
    title TEXT,
    lang TEXT,
    sub_title TEXT,
    lens TEXT,
    format TEXT,
    key_exp TEXT,
    key_exp_time TEXT,
    intermission TEXT,
    light_on TEXT,
    after TEXT
  );

  CREATE TABLE IF NOT EXISTS movie_posters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poster TEXT,
    title TEXT
  );

  CREATE TABLE IF NOT EXISTS movie_trailer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    movie_title TEXT,
    trailer TEXT,
    position INTEGER
  );

  CREATE TABLE IF NOT EXISTS movies_in_theater (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poster TEXT,
    username TEXT,
    theater_number TEXT,
    movie_title TEXT,
    tag TEXT
  );

  CREATE TABLE IF NOT EXISTS temp_movie_in_theater (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poster TEXT,
    username TEXT,
    theater_number TEXT,
    movie_title TEXT
  );

  CREATE TABLE IF NOT EXISTS phones_passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT,
    password TEXT,
    role TEXT,
    tag TEXT
  );

  CREATE TABLE IF NOT EXISTS trailers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    date TEXT,
    status TEXT,
    title TEXT,
    projectionist TEXT
  );

  CREATE TABLE IF NOT EXISTS trailers_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    image TEXT,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS commercials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    date TEXT,
    status TEXT,
    title TEXT,
    projectionist TEXT
  );

  CREATE TABLE IF NOT EXISTS commercials_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    image TEXT,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS commercials_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    username TEXT,
    projectionist TEXT,
    date TEXT,
    time TEXT,
    title TEXT,
    t_number TEXT,
    t_temp TEXT,
    p_temp TEXT,
    notes TEXT,
    sound TEXT,
    picture TEXT,
    lights TEXT,
    focus TEXT,
    poster TEXT,
    starting_time TEXT,
    additional_notes TEXT,
    fixed TEXT,
    active_key TEXT
  );

  CREATE TABLE IF NOT EXISTS updates_name_record (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    name TEXT,
    date TEXT,
    time TEXT
  );

  CREATE TABLE IF NOT EXISTS next_week (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    theater_number TEXT,
    movie_title TEXT,
    poster TEXT
  );
`);

const seedRow = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (seedRow.count === 0) {
  db.prepare(
    "INSERT INTO users (username, password, theaters_number) VALUES (?, ?, ?)"
  ).run("demo", "demo", 3);

  const defaultTypes = [
    "Dolby Atmos Trailer",
    "No Cell Phones",
    "Emergency Exits",
    "Rating Card",
    "Feature Presentation"
  ];
  const insertType = db.prepare(
    "INSERT INTO commercials_types (type) VALUES (?)"
  );
  for (const t of defaultTypes) {
    insertType.run(t);
  }
}

module.exports = db;
