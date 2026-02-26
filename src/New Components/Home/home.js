import React, { Component } from "react";
import axios from "axios";
import HomeTable from "./tabel";
import Jumbotron from "../../New Components/Jumbotron/jumbotron";
import { connect } from "react-redux";
import { message, Button, Progress } from "antd";
import username from "../../Function/username";

export default class Home extends Component {
  // ! Jumbotron
  jumbColor = { backgroundColor: "#FFD551" };
  jumbText = { color: "white" };

  // ! State
  state = {
    movie_list: null,
    movies: null,
    posters: null
  };


  render() {
    return (
      <div>
        <HomeTable />
      </div>
    );
  }
}
