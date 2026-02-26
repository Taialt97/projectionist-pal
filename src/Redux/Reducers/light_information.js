import { LIGHT_INFORMATION } from "../Actions/types";

export default function LReducer(state = [], action) {
  switch (action.type) {
    case LIGHT_INFORMATION:
      return action.light_information;
    default:
      return state;
  }
}
