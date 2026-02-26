export default function UpdaterReducer(state = false, action) {
  switch (action.type) {
    case "TRUE":
      state = true;
      break;
    case "FALSE":
      state = false;
      break;
    default:
      break;
  }
  return state;
}

