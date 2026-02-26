import {
  THEATER_MOVIES,
  LIGHT_INFORMATION,
  ALL_MOVIES,
  ALL_POSTERS
} from "./types";
import axios from "axios";
import username from "../../Function/username";

const theaterMovieURL = "/theater/movies";
const LightURL = "/theater/light";
const MoviesURL = "/movies";
const PostersURL = "/posters";

// ! THEATER_MOVIES
// Get all the movies in theater were the name is equal to the local storage username
export const MoviesInTheater = movie_titles => {
  return {
    type: THEATER_MOVIES,
    movie_titles
  };
};
// we call axios in the action, when we get the resuls we di(fucking)spatch them to the reducer
export const Movies_In_Theater = () => {
  return dispatch => {
    return axios({
      method: "get",
      url: theaterMovieURL,
      params: { username: username() }
    })
      .then(response => {
        dispatch(MoviesInTheater(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};

// ! LIGHT_INFORMATION
export const LightInformation = light_information => {
  return {
    type: LIGHT_INFORMATION,
    light_information
  };
};
export const Light_Information = () => {
  return dispatch => {
    return axios({
      method: "get",
      url: LightURL,
      params: { username: username() }
    })
      .then(response => {
        dispatch(LightInformation(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};


// ! ALL_MOVIES
export const AllMovies = all_movies => {
  console.log("action");
  return {
    type: ALL_MOVIES,
    all_movies
  };
};

export const All_Movies = () => {
  console.log("action");
  return dispatch => {
    return axios({
      method: "get",
      url: MoviesURL,
      params: { username: username() }
    })
      .then(response => {
        dispatch(AllMovies(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};

// ! ALL_POSTERS
export const AllPosters = all_posters => {
  return {
    type: ALL_POSTERS,
    all_posters
  };
};
export const All_Posters = () => {
  return dispatch => {
    return axios({
      method: "get",
      url: PostersURL
    })
      .then(response => {
        dispatch(AllPosters(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};
