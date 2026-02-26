import { NAV_THEATER_NUMBER } from "../Actions/types";


const theaters = {
    theater_number: 1
};

// for card preview in create move window
export default function TNNReducer(state = theaters, action) {
  switch (action.type) {
    case NAV_THEATER_NUMBER:
      state = {
        ...state,
        theater_number: action.payload
      };
      break;
    default:
      break;
  }
  return state;
};

