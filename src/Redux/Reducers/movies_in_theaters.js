import { THEATER_MOVIES } from "../Actions/types";

export default function MITReducer(state = [], action) {
  switch (action.type) {
    case THEATER_MOVIES:
      return action.movie_titles;
    default:
      return state;
  }
}
