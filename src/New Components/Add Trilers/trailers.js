import React, { Component } from "react";
import Select from "../Form/Inputs/select";
import { connect } from "react-redux";
import { Table, message, Tag, Divider, Modal } from "antd";
import axios from "axios";

class Trailers extends Component {
  // ! State
  state = {
    movies: [],
    trailers: []
  };

  // ! Component Did Mount
  // Creates trailer list from redux
  componentDidMount() {
    let movies = [...this.state.movies];
    for (let item of this.props.movies) {
      movies.push({ value: item.title, label: item.title, key: item.id });
    }
    this.setState({ movies: movies });

    console.log(this.props.trailers);
    let trailers = [...this.state.trailers];
    for (let item of this.props.trailers) {
      trailers.push({
        value: item.trailer,
        label: item.trailer,
        key: item.key
      });
    }
    this.setState({ trailers: trailers });
  }

  // ! Columns For Table
  columns = [
    {
      title: "Trailer",
      dataIndex: "trailer"
    },
    {
      title: "Remove",
      dataIndex: "",
      key: "x",
      render: (title, element) => (
        <span>
          <Tag color="red" onClick={() => this.removeTrailerModal(element)}>
            DELETE
          </Tag>
        </span>
      )
    }
  ];

  // ! Movie selection
  // take selected value set it to state
  // after setting take the organized list from server and set it into data (state)
  // {movies_trailer list in database}
  selectedMovie = e => {
    this.setState({ selected: e });
    const self = this;
    const user = localStorage.getItem("username");
    const url = "/movies/trailers";

    axios({
      method: "get",
      url: url,
      params: {
        username: user,
        title: e
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ data: response.data });
    });
  };

  // ! Trailer selection
  // selected treailer for postng
  selectedTrailer = e => {
    this.setState({ selected_trailer: e });
  };

  // ! Trailer Post and GET
  // Posting the trailer to the database, immidialy after succseess getting the new list from the database
  addTrailerToMovie = () => {

    

    let data = [...this.state.data];
    const url_post = "/movies/trailers/add";
    // [req.username, req.movie_title, req.trailer, req.position],
    let username = localStorage.getItem("username");
    let movie_title = this.state.selected;
    let trailer = this.state.selected_trailer;
    let position = data.length;

    console.log(this.data);
    

    for(let item of data){
      if( trailer === item.trailer ){
        message.warning("Movie is already in the list")
        return
      }
    }

    axios({
      method: "post",
      url: url_post,
      data: {
        username: username,
        movie_title: movie_title,
        trailer: trailer,
        position: position
      }
    }).then(response => {
      this.getTrailerList(); // the get function
    });
  };

  // ! Trailer Get
  // Gets new list of trailers
  getTrailerList = () => {
    const url_get = "/movies/trailers";
    let username = localStorage.getItem("username");

    let self = this;
    axios({
      method: "get",
      url: url_get,
      params: {
        username: username,
        title: this.state.selected
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ data: response.data });
    });
  };

  // ! Remove Trailer
  // Remove trailer get new list
  removeTrailer = e => {
    const url_remove = "/movie/trailers/remove";
    let username = localStorage.getItem("username");
    let self = this;

    axios({
      method: "get",
      url: url_remove,
      params: {
        id: e.id,
        movie_title: e.movie_title,
        username: username
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ data: response.data });
    });
  };

  // ! Remove Trailer Modal
  confirm = Modal.confirm;
  removeTrailerModal = value => {
    let self = this;
    this.confirm({
      title: "Are you sure you want to delete this item ?",
      content: "",
      onOk() {
        self.removeTrailer(value);
      }
    });
  };

  // ! Render
  render() {
    return (
      <div>
        <div>
          <div className="card">
            <div className="card-body">
              {/* Title of form  */}
              <h5 className="mb-0">Add New Trailers To Movies</h5>
              <p>Add and organize trailers within a specific movie</p>
              <form>
                <div className="row">
                  <div className="form-group col-12 mb-0">
                    <Select
                      label="Movie Title"
                      options={this.state.movies}
                      data={e => this.selectedMovie(e)}
                      small="Select a movie to see trailer list"
                    />
                  </div>
                </div>
              </form>

              <h4 className="mb-0">You Picked <b>{this.state.selected}</b></h4>
              <p>You can now add or organize the trailers within {this.state.selected}</p>
              <form>
                <div className="row">
                  <div className="form-group col-8 mb-0 ">
                    <Select
                      label="Movie Title"
                      options={this.state.trailers}
                      data={e => this.selectedTrailer(e)}
                      small="If you can't see the trailer it might not been added to the list"
                    />
                  </div>
                  <div className="col-4 form-group pl-0 ">
                    <label htmlFor="">Submit</label>
                    <button
                      type="button"
                      onClick={
                        this.state.selected && this.state.selected_trailer
                          ? this.addTrailerToMovie
                          : () =>
                              message.warning(
                                "Please select from the required fields"
                              )
                      }
                      className="btn btn-success btn-block mb-1"
                    >
                      Add Trailer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <br />
              <Table
                columns={this.columns}
                dataSource={this.state.data}
                size="middle"
              />
      </div>
    );
  }
}

// ! Redux
const mapStateToProps = state => {
  return { movies: state.All_Movies, trailers: state.All_Trailers };
};

export default connect(
  mapStateToProps,
  null
)(Trailers);
