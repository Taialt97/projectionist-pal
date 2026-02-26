import React, { Component } from "react";
import { Table, Tag, Button, message, Popconfirm } from "antd";
import Select from "../Form/Inputs/select";
import axios from "axios";
import { connect } from "react-redux";
import username from "../../Function/username";

class NextWeek extends Component {
  state = {
    transferring: [],
    options: []
  };

  getData = () => {
    // get temp table
    let url = "/next_week";
    let current_nav_theater = this.props.theater; // from redux
    let self = this;

    axios({
      method: "get",
      url: url,
      params: {
        username: username(),
        theater_number: current_nav_theater
      }
    }).then(function(response) {
      self.setState({ transferring: response.data });
    });
  };

  forSelect = () => {
    let all_movies = this.props.movies;
    console.log(all_movies);
    let options = [];

    for (let item of all_movies) {
      let poster = this.props.posters.find(function(element) {
        return element.title === item.title;
      });

      let obj = {
        value: {
          id: item.id,
          username: username(),
          theater_number: this.props.theater,
          movie_title: item.title,
          poster: poster.poster,
          key_date: item.key_exp,
          key_time: item.key_exp_time
        },

        label: item.title
      };
      options.push(obj);
    }
    return options
  };

  componentDidMount() {
    this.getData();
    // set the redux all movies array to readable obj for select
    this.forSelect();
  }


  // ! Columns
  columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (poster, index) => (
        <img
          src={`/public/uploads/${poster}`}
          alt={index.movie_title}
          height="50"
        />
      )
    },
    {
      title: "Movie Title",
      dataIndex: "movie_title",
      render: movie => <h5>{movie}</h5>
    },
    {
      title: "Status",
      dataIndex: "tag",
      render: () => <Tag color="gold"> To Next Week </Tag>
    },
    {
      title: "Finish Transferring",
      dataIndex: "button",
      render: (button, index) => (
        <Popconfirm
          placement="topRight"
          title={
            <div>
              Make sure you transferred the movie to<br />
              the transferring list before <br />
              deleting the movie from this table
            </div>
          }
          onConfirm={() => this.remove(index)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p style={{ color: "red", cursor: "pointer" }}>
            Remove
          </p>{" "}
        </Popconfirm>
      )
    }
  ];

















  getSelected = (selected, name) => {
    this.setState({ selected: selected });
  };



  tempTransfer = () => {

    let selected = this.state.selected;
    console.log(selected);

    let temp_movie = this.state.transferring.find(function(element) {
      console.log(element.title);
      return element.movie_title === selected.movie_title;
    });

    console.log(temp_movie);
    if (temp_movie) {
      message.warning("Movie already transferring");
      return;
    }

    let table_movie = this.props.data.find(function(element) {
      console.log(element.title);
      return element.movie_title === selected.movie_title;
    });

    if (table_movie) {
      message.warning("Movie already in theater");
      return;
    }

    console.log(selected);
    let url = "/next_week/add";
    let self = this;
    axios({
      method: "post",
      url: url,
      data: selected
    }).then(function(response) {
      self.setState({ transferring: response.data });
      console.log(self.state.transferring);
    });
  };


  remove = (e) =>{
    console.log(e);

    let url = "/next_week/remove";
    let self = this;
    axios({
      method: "get",
      url: url,
      params: e
    }).then(function(response) {
      self.setState({ transferring: response.data });
      console.log(self.state.transferring);
    });
  }

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
        <div
          className="card"
          style={{
            borderColor: this.state.transferring.length > 0 ? "orange" : ""
          }}
        >
          <div className="card-body">
            <h5 class="card-title">Add Movie To Theater</h5>
            <div className="row">
              {/* Title */}
              <div className="form-group col-8" style={{ zIndex: "99" }}>
                <Select
                  label="Movie Name"
                  name="title"
                  options={this.forSelect()}
                  data={(selected, name) => this.getSelected(selected, name)}
                  small="Try doing this before completing transferring in the software"
                />
              </div>
              <div className="col-4 pl-0">
                <label>Start Transferring </label>
                <button
                  onClick={() => this.tempTransfer()}
                  type="button"
                  className="btn btn-outline-primary btn-block"
                >
                  Save For Next Week{" "}
                </button>
              </div>
            </div>
            <Table
              columns={this.columns}
              dataSource={this.state.transferring}
              size="small"
              pagination={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    movies: state.All_Movies,
    theater: state.Theaters_Nav_Number.theater_number,
    posters: state.All_Posters
  };
};

export default connect(
  mapStateToProps,
  null
)(NextWeek);
