const login = [];

// for card preview in create move window
export default function LIReducer(state = login, action) {
  switch (action.type) {
    case "LOGIN":
      state =  action.payload
      break;
    default:
      break;
  }
  return state;
}
