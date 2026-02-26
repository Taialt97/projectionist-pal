// ------------------------------ Require
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

// ------------------------------ Init app
const app = express();
const port = process.env.PORT || 5050;

// ------------------------------ Cors
app.use(cors());

// ------------------------------ Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "json" }));

// ------------------------------ Static files
// Serve React build first (has compiled index.html)
app.use(express.static(path.join(__dirname, "build")));
// Serve uploaded files and public assets
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

// ------------------------------ Multer Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },

  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const upload = multer({ storage });

// ------------------------------------------------
// ------------------------------------------------
// ! Functions
// ------------------------------------------------
// ------------------------------------------------

// ------------------------------------------------
// ! TABLE: commercials
const commercials = require("./Components/MySql_Tables/commercials");
// ------------------------------------------------

app.get("/commercials", async (req, res) => {
  let date = await commercials_image.GET_LAST_COMMERCIALS_IMAGE(req.query);
  let _commercials = await commercials.GET_UPDATED_COMMERCIALS_WITH_COMMERCIALS_LIST(
    req.query,
    date
  );
  res.send(_commercials);
});

app.post("/commercials/update", async (req, res) => {
  let proj = await trailers.GET_PROJECTIONIST(req.body);
  await commercials.UPDATE_COMMERCIALS(req.body, proj);
  let image = await commercials_image.GET_LAST_COMMERCIALS_IMAGE(req.body);
  let result = await commercials.GET_UPDATED_COMMERCIALS_WITH_COMMERCIALS_LIST(
    req.body,
    image
  );
  res.send(result);
});

// ------------------------------------------------
// ! TABLE : commercials_images
const commercials_image = require("./Components/MySql_Tables/commercials_images");
// ------------------------------------------------
app.get("/commercials/images", async (req, res) => {
  let result = await commercials_image.GET_LAST_COMMERCIALS_IMAGE(req.query);
  res.send(result);
});

// OK
// When uploading a new image check if the image got uploaded today
// if it was, remove all the updates from today
app.post(
  "/commercials/images/upload",
  upload.single("selectedFile"),
  async (req, res) => {
    await commercials_image.NEW_COMMERCIALS_IMAGE(req);
    let image = await commercials_image.GET_LAST_COMMERCIALS_IMAGE(req.body);
    let update = await commercials.GET_LAST_UPDATED_COMMERCIALS(req.body);

    let d = image[0].updated;
    const nd = String(
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    );

    let image_date;
    let last_update_date;
    console.log("image", image[0]);
    console.log("update", update[0]);

    if (image[0]) {
      image_date = nd;
    }

    if (update[0]) {
      last_update_date = update[0].date;
    }

    if (image_date === last_update_date) {
      console.log("REMOVING");
      await commercials.REMOVE_COMMERCIALS(update);
    }

    let updated_commercials = await commercials.GET_UPDATED_COMMERCIALS_WITH_COMMERCIALS_LIST(
      req.body
    );

    // merge the image result and the updated commercials
    let arr = {};
    arr.image = image;
    arr.updated = updated_commercials;
    console.log("arr", arr);
    res.send(arr);
  }
);

// ------------------------------------------------
// ! TABLE: light
const light = require("./Components/MySql_Tables/light");
// ------------------------------------------------

app.get("/theater/light", async (req, res) => {
  let _light = await light.GET_LIGHT_INFO(req.query);
  res.send(_light);
});

app.post("/theater/light/update", async (req, res) => {
  await light.UPDATE_LIGHT(req.body);
  let _light = await light.GET_LIGHT_INFO(req.body);
  res.send(_light);
});

// ------------------------------------------------
// ! TABLE: movie_info
const movie_info = require("./Components/MySql_Tables/movie_info");
// ------------------------------------------------

app.get("/movies/remove-movie", async (req, res) => {
  await movie_info.REMOVE_MOVIE(req.query);
  let movies = await movie_info.ALL_MOVIES(req.query);
  res.send(movies);
});

app.get("/movies", async (req, res) => {
  let movies = await movie_info.ALL_MOVIES(req.query);
  res.send(movies);
});

app.get("/movies/titles", async (req, res) => {
  let titles = await movie_info.ALL_MOVIES_TITLES();
  res.send(titles);
});

app.post("/movies/add", async (req, res) => {
  console.log(req.body.form);
  await movie_info.NEW_MOVIE_INFO(req.body.form);
  let movies = await movie_info.ALL_MOVIES(req.body);
  res.send(movies);
});

app.post("/key/update", async (req, res) => {
  await movie_info.UPDATE_KEY_ALL_MOVIES(req.body);
  let key = await movie_info.ALL_MOVIES(req.body);
  res.send(key);
});

app.post("/storage/update", async (req, res) => {
  await movie_info.UPDATE_STORAGE(req.body);
  let key = await movie_info.ALL_MOVIES(req.body);
  res.send(key);
});

// ------------------------------------------------
// ! TABLE: movie_posters
const movie_posters = require("./Components/MySql_Tables/movie_posters");
// ------------------------------------------------

app.get("/posters", async (req, res) => {
  let posters = await movie_posters.GET_MOVIE_POSTER();
  res.send(posters);
});

app.post(
  "/movies/add/poster",
  upload.single("selectedFile"),
  async (req, res) => {
    await movie_posters.NEW_POSTER(req);
    let posters = await movie_posters.GET_MOVIE_POSTER();
    res.send(posters);
  }
);

// ------------------------------------------------
// ! TABLE: movie_trailer
const movie_trailer = require("./Components/MySql_Tables/movie_trailer");
// ------------------------------------------------

app.get("/movies/trailers", async (req, res) => {
  let trailers = await movie_trailer.GET_MOVIE_TRAILERS(req.query);
  res.send(trailers);
});

app.get("/movie/trailers/remove", async (req, res) => {
  let trailers = await movie_trailer.REMOVE_MOVIE_TRAILERS(req.query);
  res.send(trailers);
});

app.post("/movies/trailers/add", (req, res) => {
  movie_trailer.UPLOAD_MOVIE_TRAILER(req.body);
  res.send("Success");
});

// ------------------------------------------------
// ! TABLE: movies_in_theater
const movies_in_theater = require("./Components/MySql_Tables/movies_in_theater");
// ------------------------------------------------

app.get("/theater/movies", async (req, res) => {
  let movies = await movies_in_theater.MOVIES_IN_THEATERS(req.query);
  res.send(movies);
});

app.get("/theater/movies/remove", async (req, res) => {
  await movies_in_theater.REMOVE_MOVIE_FROM_THEATER(req.query);
  let movies = await movies_in_theater.MOVIES_IN_THEATERS(req.query);
  res.send(movies);
});

app.get("/theater/movies/all", async (req, res) => {
  let result = await movies_in_theater.ALL_THEATER_MOVIES(req.query);
  res.send(result);
});

app.post("/theater/movies/update", async (req, res) => {
  await movies_in_theater.UPDATE_TAG_MOVIES_IN_THEATERS(req.body);
  let movies = await movies_in_theater.MOVIES_IN_THEATERS(req.body);
  res.send(movies);
});

app.post("/theater/movies/post", async (req, res) => {
  await movies_in_theater.MOVIES_IN_THEATER(req.body);
  let temp = await temp_movies_in_theater.TEMP_THEATER(req.body);
  res.send(temp);
});

// ------------------------------------------------
// ! TABLE: phones_passwords
const phones_passwords = require("./Components/MySql_Tables/phones_passwords");
// ------------------------------------------------

app.get("/phones_passwords/add", async (req, res) => {
  let pnp = await phones_passwords.ADD_PNP(req.query);
  res.send(pnp);
});

app.get("/phones_passwords", async (req, res) => {
  let allpnp = await phones_passwords.ALL_PNP(req.query);
  res.send(allpnp);
});

app.get("/phones_passwords/remove", async (req, res) => {
  let removepnp = await phones_passwords.REMOVE_PNP(req.query);
  res.send(removepnp);
});

// ------------------------------------------------
// ! TABLE : schedule
const schedule = require("./Components/MySql_Tables/schedule");
// ------------------------------------------------

app.get("/schedule", async (req, res) => {
  let _schedule = await schedule.GET_TODAY_SCHEDULE(req.query);
  res.send(_schedule);
});

app.get("/schedule/remove", async (req, res) => {
  let _schedule = await schedule.REMOVE_SCHEDULE_CREATE_NEW(req.query);
  res.send(_schedule);
});

app.post("/schedule/add", (req, res) => {
  for (let item of req.body.data) {
    schedule.NEW_SCHEDULE_ROW(item);
  }
  res.send("Success");
});

// ------------------------------------------------
// ! TABLE : temp_movies_in_theater
const temp_movies_in_theater = require("./Components/MySql_Tables/temp_movies_in_theater");
// ------------------------------------------------

// UPLOAD AND GET STORAGE
app.post("/temp/theater/movies", async (req, res) => {
  console.log("update", req.body);
  await temp_movies_in_theater.TEMP_MOVIES_IN_THEATERS(req.body); // needs a promiss in the post
  let temp = await temp_movies_in_theater.TEMP_THEATER(req.body);
  res.send(temp);
});

// GET FROM TEMP THEATERS
app.get("/temp/theater/movies", async (req, res) => {
  let temp = await temp_movies_in_theater.TEMP_THEATER(req.query);
  res.send(temp);
});

// ------------------------------------------------
// ! TABLE : trailers
const trailers = require("./Components/MySql_Tables/trailers");
// ------------------------------------------------

app.get("/trailers", async (req, res) => {
  let date = await trailers_image.GET_LAST_TRAILER_IMAGE(req.query);
  let _trailers = await trailers.GET_UPDATED_TRAILERS_WITH_MOVIE_LIST(
    req.query,
    date
  );
  res.send(_trailers);
});

app.post("/trailers/update", async (req, res) => {
  let proj = await trailers.GET_PROJECTIONIST(req.body);
  await trailers.UPDATE_TRAILERS(req.body, proj);
  let image = await trailers_image.GET_LAST_TRAILER_IMAGE(req.body);
  let result = await trailers.GET_UPDATED_TRAILERS_WITH_MOVIE_LIST(
    req.body,
    image
  );
  res.send(result);
});

// ------------------------------------------------
// ! TABLE : trailers_images
const trailers_image = require("./Components/MySql_Tables/trailers_images");
// ------------------------------------------------

app.get("/trailers/images", async (req, res) => {
  let result = await trailers_image.GET_LAST_TRAILER_IMAGE(req.query);
  res.send(result);
});

// OK
// When uploading a new image check if the image got uploaded today
// if it was, remove all the updates from today
app.post(
  "/trailers/images/upload",
  upload.single("selectedFile"),
  async (req, res) => {
    await trailers_image.NEW_TRAILER_IMAGE(req);
    let image = await trailers_image.GET_LAST_TRAILER_IMAGE(req.body);
    let update = await trailers.GET_LAST_UPDATED_TRAILER(req.body);

    let d = image[0].updated;
    const nd = String(
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    );

    let image_date;
    let last_update_date;
    console.log("image", image[0]);
    console.log("update", update[0]);

    if (image[0]) {
      image_date = nd;
    }

    if (update[0]) {
      last_update_date = update[0].date;
    }

    if (image_date === last_update_date) {
      console.log("REMOVING");
      await trailers.REMOVE_TRAILERS(update);
    }

    let updated_trailers = await trailers.GET_UPDATED_TRAILERS_WITH_MOVIE_LIST(
      req.body
    );

    // merge the image result and the updated trailers
    let arr = {};
    arr.image = image;
    arr.updated = updated_trailers;
    console.log("arr", arr);
    res.send(arr);
  }
);

// ------------------------------------------------
// ! TABLE : updates
const updates = require("./Components/MySql_Tables/updates");
// ------------------------------------------------

app.get("/updates/all", async (req, res) => {
  let _updates = await updates.GET_ALL_UPDATES(req.query);
  res.send(_updates);
});

app.get("/daily/all", async (req, res) => {
  let _updates = await updates.GET_ALL_DAILY_UPDATES(req.query);
  res.send(_updates);
});

app.post("/daily", async (req, res) => {
  await updates.DAILY_UPDATES(req.body);
  let _schedule = await schedule.GET_TODAY_SCHEDULE(req.body);
  res.send(_schedule);
});

app.get("/unreg-update", async (req, res) => {
  await updates.UNREG_UPDATES(req.query);
  res.send("Success");
});

// ------------------------------------------------
// ! TABLE : users
const users = require("./Components/MySql_Tables/users");
// ------------------------------------------------

app.get("/users", async (req, res) => {
  let _users = await users.SELECTION_USERS();
  res.send(_users);
});

app.get("/login", async (req, res) => {
  let login = await users.LOGIN(req);
  res.send(login);
});

app.get("/users/all", async (req, res) => {
  let username = await users.ALL_USERS();
  res.send(username);
});

app.post("/users/create", (req, res) => {
  users.CREATE_USER(req.body);
  res.send("Success");
});

// ------------------------------------------------
// ! TABLE : updates_name_record
const updates_name = require("./Components/MySql_Tables/updates_name_record");
// ------------------------------------------------

app.post("/updates_name_record", async (req, res) => {
  console.log(req.body);
  await updates_name.ADD_NAME_TO_UPDATE_RECORD(req.body);
  res.send("Success");
});

app.get("/updates_name_record/get", async (req, res) => {
  console.log(req.query);
  let result = await updates_name.GET_NAMES(req.query);
  res.send(result);
});

// ------------------------------------------------
// ! TABLE : next_week
const next_week = require("./Components/MySql_Tables/next_week");
// ------------------------------------------------

app.get("/next_week", async (req, res) => {
  let result = await next_week.GET_NEXT_WEEK(req.query);
  res.send(result);
});

app.post("/next_week/add", async (req, res) => {
  await next_week.ADD_TO_NEXT_WEEK(req.body);
  let result = await next_week.GET_NEXT_WEEK(req.body);
  res.send(result);
});

app.get("/next_week/remove", async (req, res) => {
  await next_week.REMOVE_NEXT_WEEK(req.query);
  let result = await next_week.GET_NEXT_WEEK(req.query);
  res.send(result);
});

// Catch-all: serve React app for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Listening On Port: ${port}`));
