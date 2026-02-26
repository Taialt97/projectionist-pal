import { ALL_POSTERS } from "../Actions/types";

export default function APReducer(state = [], action) {
  switch (action.type) {
    case ALL_POSTERS:
      return action.all_posters;
    default:
      return state;
  }
}
