import { ALL_MOVIES } from "../Actions/types";

export default function AMReducer(state = [], action) {
  switch (action.type) {
    case ALL_MOVIES:
      console.log("Hello all movies");
      return action.all_movies;

    default:
      return state;
  }
}
