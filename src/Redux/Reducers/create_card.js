import { CREATE_CARD } from "../Actions/types";


const create_movie_form = {
  form: {}
};

// for card preview in create move window
export default function CCReducer(state = create_movie_form, action) {
  switch (action.type) {
    case CREATE_CARD:
      state = {
        ...state,
        form: action.payload
      };
      break;
    default:
      break;
  }
  return state;
};

