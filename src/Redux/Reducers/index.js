import { combineReducers } from "redux";
import MITReducer from "./movies_in_theaters";
import LReducer from "./light_information";
import CCReducer from "./create_card";
import AMReducer from "./all_movies";
import TNNReducer from "./nav_theater_number";
import APReducer from "./all_posters";
import LIReducer from "./login";
import UpdaterReducer from "./updater";
import Updater_Shift from "./updater_shift";


// Basicly the store tree
export default combineReducers({
  Movies_In_Theater: MITReducer,
  Light_Information: LReducer,
  All_Movies: AMReducer,
  Create_Card_Form: CCReducer,
  Theaters_Nav_Number: TNNReducer,
  All_Posters: APReducer,
  Login: LIReducer,
  Updater: UpdaterReducer,
  Updater_Shift : Updater_Shift
});
