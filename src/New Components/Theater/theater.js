import React, { Component } from "react";
import Jumbotron from "../Jumbotron/jumbotron";
import NavT from "./nav";
import { connect } from "react-redux";
import axios from "axios";
import {
  Icon,
  Popover,
  Button,
  Table,
  Tag,
  Divider,
  Drawer,
  Popconfirm
} from "antd";
import Light from "./light";
import Uploader from "./uploader";
import Header from "../Page Header/header";
import { Route, Link } from "react-router-dom";
import update from "../../Function/updater";
import username from "../../Function/username";
import AMReducer from "../../Redux/Reducers/all_movies";
import NextWeek from "./next_week";
class Theater extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      visible: false,
      date: "",
      table_data: [],
      lights: this.props.light,
      theater: 1,
      prompt: "Welcome To Theaters",
      color: "black",
      light: {
        type: "",
        serial: "",
        max_light: "",
        light_on: "",
        date: "",
        reason: "",
        exploitation: ""
      }
    };
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  // ! Component Did Mount
  // get all the movies by username and redux theater number (1)
  componentDidMount() {
    this.getData();
    console.log(this.props.theater);
  }

  getData = () => {
    const theater = this.props.theater;
    const url = "/theater/movies";
    const self = this;
    axios({
      method: "get",
      url: url,
      params: {
        username: username(),
        theater: theater // theater number from redux
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ table_data: response.data });
    });

    // for key exp
    let date = new Date();
    date.setDate(date.getDate() + 10);

    let date_date = String(
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
    this.setState({ date: date_date });
  };

  // ! Drawer Columns
  table_columns_all = [
    {
      title: "Movie Title",
      dataIndex: "title",
      render: title => (
        <span>
          <h4>{title}</h4>
        </span>
      )
    },
    {
      title: "Expiration Date",
      dataIndex: "key_exp"
    },
    {
      title: "Expiration Time",
      dataIndex: "key_exp_time"
    },
    {
      title: "In Storage",
      dataIndex: "storage",
      render: (storage, index) =>
        storage === 1 ? (
          <Tag color="green" onClick={() => this.storage(0, index)}>
            {" "}
            In Storage{" "}
          </Tag>
        ) : (
          <Tag color="red" onClick={() => this.storage(1, index)}>
            {" "}
            Not In Storage{" "}
          </Tag>
        )
    },
    {
      title: "Remove",
      dataIndex: "remove",
      render: (index, element) => (
        <Popconfirm
          placement="topRight"
          title={
            <div>
              Are you sure you want to remove <br />
              this movie permanently
            </div>
          }
          onConfirm={() => this.removeMovie(element)}
          okText="Yes"
          cancelText="No"
        >
          <a style={{ color: "red", cursor: "pointer" }}>Remove</a>
        </Popconfirm>
      )
    }
  ];

  // ! Add or remove from storage
  storage = (value, item) => {
    const url = "/storage/update";
    const self = this;
    axios({
      method: "post",
      url: url,
      data: {
        username: username(),
        storage: value,
        id: item.id
      }
    }).then(function(response) {
      console.log(response.data);
      self.props.movies(response.data);
    });
  };

  // ! Remove Movie
  removeMovie = e => {
    const url = "/movies/remove-movie";
    const self = this;
    console.log(e.id);

    axios({
      method: "get",
      url: url,
      params: { id: e.id, username: username() }
    }).then(function(response) {
      self.props.movies(response.data);
    });
  };

  // ! Tables Columns
  table_columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      render: (poster, index) => (
        <span>
          <img
            src={`/public/uploads/${poster}`}
            alt={index.movie_title}
            height="50"
          />
        </span>
      )
    },
    {
      title: "Movie Title",
      dataIndex: "movie_title",
      key: "movie_title",
      render: title => (
        <span>
          <h4>{title}</h4>
        </span>
      )
    },
    {
      title: "Theater",
      dataIndex: "theater_number",
      render: title => (
        <span>
          <p>Theater {title}</p>
        </span>
      )
    },
    {
      title: "Key Exp Date",
      dataIndex: "key_exp",
      render: key_exp =>
        key_exp ? <Link to="/keys"> {key_exp.substring(0, 10)} </Link> : ""
    },
    {
      title: "Key Exp Time",
      dataIndex: "key_exp_time",
      render: key_exp_time => <Link to="/keys"> {key_exp_time} </Link>
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "tag",
      render: tag => (
        <Tag
          color={
            tag === "in theater"
              ? "green"
              : tag === "not screening this week"
              ? "purple"
              : tag === "event"
              ? "cyan"
              : tag === "3d"
              ? "volcano"
              : tag === "do not delete"
              ? "red"
              : "gray"
          }
        >
          {tag.toUpperCase()}
        </Tag>
      )
    },

    {
      title: "Change Status",
      dataIndex: "status",
      render: (text, element) => (
        <span>
          <Popover
            onClick={() => (this.current = element)}
            content={
              <div>
                <Tag
                  onClick={() => this.changeTags("in theater", element)}
                  className="mb-2"
                  color="green"
                >
                  IN THEATER
                </Tag>{" "}
                <br />
                <Tag
                  onClick={() =>
                    this.changeTags("not screening this week", element)
                  }
                  className="mb-2"
                  color="purple"
                >
                  NOT SCREENING THIS WEEK
                </Tag>
                <br />
                <Tag
                  onClick={() => this.changeTags("event", element)}
                  className="mb-2"
                  color="cyan"
                >
                  EVENT
                </Tag>
                <Tag
                  onClick={() => this.changeTags("do not delete", element)}
                  className="mb-2"
                  color="red"
                >
                  DO NOT DELETE
                </Tag>
              </div>
            }
            title="Chose Status"
            trigger="click"
          >
            <span style={{ cursor: "pointer", color: "rgb(38, 132, 255)" }}>
              Change Status
            </span>
          </Popover>
          <Divider type="vertical" />

          <Popconfirm
            placement="topRight"
            title={
              <div>
                Are you sure you want to remove <br />
                this movie from the theater
              </div>
            }
            onConfirm={() => this.removeFromTheater(element)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{ color: "red", cursor: "pointer" }}>Remove</a>
          </Popconfirm>
          <Popover />
        </span>
      )
    }
  ];

  // ! Tables Columns
  // change tag, post to the list get back list
  changeTags = (tag, element) => {
    let self = this;

    update(
      5,
      `Updated ${element.movie_title} Status`,
      `Updated ${element.movie_title} To "${tag}"`
    );

    axios({
      method: "post",
      url: "/theater/movies/update",
      data: {
        tag: tag,
        id: element.id,
        username: username(),
        theater: this.props.theater
      }
    }).then(function(response) {
      self.setState({ table_data: response.data });
    });
  };

  // ! Remove from theater
  removeFromTheater = e => {
    console.log(e);

    update(5, `Removed ${e.movie_title} From Theater ${e.theater_number}`);

    let self = this;
    axios({
      method: "get",
      url: "/theater/movies/remove",
      params: e
    }).then(function(response) {
      console.log(response.data);
      self.setState({ table_data: response.data });
    });
  };

  theater = this.props.theater;
  render() {
    console.log(this.theater);
    console.log(this.props.theater);
    if (this.theater !== this.props.theater) {
      this.getData();
      this.theater = this.props.theater;
    }

    return (
      <div>
        {/* import Header from "../Page Header/header"; */}
        <Header
          title="Theater Setups"
          content={
            <div>
              <h5>
                Here you can add update the light information and the movies in
                the theater. <br />
                Make sure the movie finished uploading to the server
                successfully <br /> before finishing the transferring here.{" "}
              </h5>
            </div>
          }
          color="#03A9F4"
        />
        {/* <Jumbotron
          color={this.jumbColor}
          text={this.jumbText}
          header={"Theater Setup And Updates"}
          lead={"Theater Setups"}
        /> */}
        <button
          onClick={() => this.showDrawer()}
          type="button"
          class="my-3 btn btn-block btn-outline-primary"
        >
          All Movies
        </button>
        <div className="mt-3" />
        <NavT theater={data => this.theaterNumber(data)} />
        <h2 className="mb-0"> Theater {this.props.theater} </h2>
        <h4 style={{ color: this.state.color }}> {this.state.prompt} </h4>
        <Light data={this.props.light} />
        <br />
        <NextWeek data={this.state.table_data} />
        <br />
        <Uploader
          data={this.state.table_data}
          theaterTable={() => this.getData()}
        />
        <br />
        <Table
          dataSource={this.state.table_data}
          columns={this.table_columns}
          size="middle"
        />

        <Drawer
          width={600}
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <h3 className="mb-0"> Movies In All Theaters </h3>
          <p> All the movies in all theaters combined </p>
          <hr />
          <Table
            size="small"
            columns={this.table_columns_all}
            dataSource={this.props.all_movies}
          />
        </Drawer>
      </div>
    );
  }
}

const All_Movies = dispatch => {
  return {
    movies: value => {
      dispatch({
        type: "ALL_MOVIES",
        all_movies: value
      });
    }
  };
};

const mapStateToProps = state => {
  return {
    light: state.Light_Information,
    theater: state.Theaters_Nav_Number.theater_number,
    movies: state.Movies_In_Theater,
    posters: state.All_Posters,
    all_movies: state.All_Movies
  };
};

export default connect(
  mapStateToProps,
  All_Movies
)(Theater);
