import React, { Component } from "react";
import Navbar from "./New Components/Nav Bar/nav";
import { BrowserRouter } from "react-router-dom";
import Login from "./New Components/Login/login";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import Register from "./New Components/Login/register";
import "antd/dist/antd.css";
import Loging from "./New Components/Loging/loging";
import UserHeader from "./New Components/Page Header/user_header";
import axios from "axios";
import username from "./Function/username";
import Header from "./New Components/Page Header/header";

class App extends Component {
  render() {
    if (!localStorage.getItem("updated")) {
      localStorage.setItem("updated", JSON.stringify([]));
    }

    const active_username = username();

    if (this.props.login === true || active_username) {
      console.log("Logged In");

      if (this.props.updater === false || this.props.updater_shift === true) {
        return (
          <div className="App container mt-3">
            <UserHeader />
          </div>
        );
      } else {
        return (
          <BrowserRouter>
            <div className="App container mt-3">
              <Navbar />
            </div>
          </BrowserRouter>
        );
      }
    } else {
      return (
        <BrowserRouter>
          <div className="App container">
            <Route path="/" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </div>
        </BrowserRouter>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    login: state.Login,
    updater: state.Updater,
    updater_shift : state.Updater_Shift
  };
};

export default connect(
  mapStateToProps,
  null
)(App);

// class App extends Component {

//   render() {
//     if (!localStorage.getItem("updated")) {
//       localStorage.setItem("updated", JSON.stringify([]));
//     }

//     let username = localStorage.getItem("username");

//     if (this.props.login === true || username) {

//     //   console.log("logged In");

//     // const projectionist = value => {
//     //   if (value === 0) {
//     //     console.log("no projectionist");
//     //     return ("HO")
//     //   } else {
//         return (
//           <BrowserRouter>
//             <div className="App container mt-3">
//               <Navbar />
//             </div>
//           </BrowserRouter>
//         );
//       }
//     };

//     return (
//       <BrowserRouter>
//         <div className="App container">
//           <Route path="/" exact component={Login} />
//           <Route path="/register" exact component={Register} />
//         </div>
//       </BrowserRouter>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return { login: state.Login };
// };

// export default connect(
//   mapStateToProps,
//   null
// )(App);
