export default function Updater_Shift(state = false, action) {
    switch (action.type) {
      case "TRUE_SHIFT":
        state = true;
        break;
      case "FALSE_SHIFT":
        state = false;
        break;
      default:
        break;
    }
    return state;
  }
  