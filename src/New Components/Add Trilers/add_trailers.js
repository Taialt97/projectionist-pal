import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Table, Divider, Tag, message, Modal, Button } from "antd";
import { connect } from "react-redux";

class AddTrailer extends Component {
  // ! State
  constructor(props) {
    super(props);
    this.state = {
      trailers: this.props.trailers // will hold trailers list
    };
  }

  componentDidMount() {
    let arr = [];
    for (let item of this.props.trailers) {
      arr.push(item.trailer);
    }
    this.setState({ trailers_array: arr });
  }

  // ! Add Trailer
  // guess what it dose
  AddTrailer = e => {
    e.preventDefault(); // cuz no refreshes man

    let trailer = document.getElementById("Trailer").value;
    let trailer_check = trailer.replace(/\s/g, "").toUpperCase(); // no spaces all uppercase

    for (let item of this.props.trailers) {
      let item_check = item.trailer.replace(/\s/g, "").toUpperCase();

      if (trailer_check === item_check) {
        message.warning("Trailer already in list");
        return;
      }
    }

    // if no trailer was filled shows notifiction
    if (trailer === "") {
      e.preventDefault();
      let props = {
        message: "No Trailer Was Inserted",
        description:
          "Please write the trailer name in the corresponding area, after finishing click 'Add New Trailer'",
        icon: "exclamation-circle",
        color: "#F69F00"
      };
      alert(props);
      return;
    }

    // so... what we do here is (go back, not really)
    // we take the trailer value and we push it to the state, Reduxe's state (store), and this current state.
    // we do that cuz we want the component to show the list after unmounting and we want it to show the list now.
    // also after the submitting we get a cure success :D
    let trailers = [...this.state.trailers];
    let d = new Date();
    let date = String(
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    );

    let new_trailer = {
      key: trailers.length + 1,
      trailer: trailer,
      created: date,
      remove: trailer
    };

    trailers.unshift(new_trailer);
    this.setState({ trailers: trailers });
    this.props.trailersUpdate(new_trailer, "UPDATE_TRAILER");
    message.success("Trailer Uploaded Successfully", 1);
    // post trailers
    let url = "/trailers/add";
    axios({
      method: "post",
      url: url,
      data: {
        label: trailer
      }
    }).then(res => {});
  };

  // ! Remove Trailer
  // send the id of the trailer to remove func in server

  // Just to make sure he really wants to
  removeTrailerActivation(value) {
    const confirm = Modal.confirm;
    let self = this;
    confirm({
      title: "Are you sure delete this Trailer ?",
      content: "The trailer will be deleted from all theaters in the country",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        self.removeTrailer(value);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  removeTrailer(value) {
    let url = "/trailers/remove";
    let rt = this.props.trailers; // redux trailers

    // Find the trailer same to the remove value
    let trailer = rt.find(function(element) {
      return element.trailer === value;
    });

    // Remove the trailer from the array, return new array
    let filtered_trailers = rt.filter(function(value, index, arr) {
      return value !== trailer;
    });

    // update this state and send new array to the store were it will compleatly replace the store
    this.setState({ trailers: filtered_trailers });
    this.props.trailersUpdate(filtered_trailers, "REMOVE_TRAILER");
    message.success("Trailer Removed Successfully", 1);

    // remove trailer from database
    axios({
      method: "get",
      url: url,
      params: { title: value }
    }).then(function(response) {
      console.log(response);
    });
  }

  // ! Table columns
  columns = [
    {
      title: "Trailer Name",
      dataIndex: "trailer",
      key: "trailer"
    },
    {
      title: "Created at",
      dataIndex: "created",
      key: "created"
    },
    {
      title: "Remove",
      dataIndex: "remove",
      key: "remove",
      render: remove => (
        <span>
          <Tag color="red" onClick={() => this.removeTrailerActivation(remove)}>
            REMOVE
          </Tag>
        </span>
      )
    }
  ];

  // ! Render
  render() {
    return (
      <div>
        <div>
          <form onSubmit={e => this.AddTrailer(e)}>
            <div className="card">
              <div className="card-body">
                {/* Title of form  */}
                <h5 className="mb-0">Add New Trailers</h5>
                <p>Add new trailers to full triler list</p>
                <div className="row">
                  {/* Title */}
                  <div className="form-group col-8">
                    <label>Add new Trailer</label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="Trailer"
                      placeholder="Name of trailer (Copy the exact name from the email)"
                    />
                    <small style={{ color: "gray" }}>
                      Please make sure to write the trailer name correctly 
                    </small>
                  </div>
                  <div className="col-4 pl-0">
                    <label>Add new Trailer</label>
                    <button type="submit" className="btn btn-success btn-block">
                      Add Trailer To List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <br />
        <Table
          columns={this.columns}
          dataSource={this.state.trailers}
          size="middle"
        />
      </div>
    );
  }
}

// ! Redux
const mapStateToProps = state => {
  return { trailers: state.All_Trailers };
};

const UpdateTrailer = dispatch => {
  return {
    trailersUpdate: (value, type) => {
      switch (type) {
        case "UPDATE_TRAILER":
          dispatch({
            type: "UPDATE_TRAILER",
            payload: value
          });
          break;

        case "REMOVE_TRAILER":
          dispatch({
            type: "REMOVE_TRAILER",
            payload: value
          });
          break;

        default:
          break;
      }
    }
  };
};

export default connect(
  mapStateToProps,
  UpdateTrailer
)(AddTrailer);
