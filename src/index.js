import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import App from "./App";
import rootReducer from "./Redux/Reducers";
import * as serviceWorker from "./serviceWorker";
import { composeWithDevTools } from "redux-devtools-extension";
import "./index.css";

// actions
import {
  Movies_In_Theater,
  Light_Information,
  All_Movies,
  All_Posters
} from "./Redux/Actions/index";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

store.dispatch(Movies_In_Theater());
store.dispatch(Light_Information());
store.dispatch(All_Movies());
store.dispatch(All_Posters());

ReactDOM.render(
  <Provider store={store}>
    <App />,
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
