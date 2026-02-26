import React, { Component } from "react";
import axios from "axios";
import username from "../../Function/username";
import { connect } from "react-redux";
import { UPDATER } from "../../Redux/Actions/types";
import { message } from "antd";

class UserHeader extends Component {
  state = {
    projectionist: "",
    name: ""
  };

  d = new Date();
  date =
    this.d.getFullYear() +
    "-" +
    (this.d.getMonth() + 1) +
    "-" +
    this.d.getDate();

  time =
    this.d.getHours() + ":" + this.d.getMinutes() + ":" + this.d.getSeconds();

  logName = e => {
    this.setState({ name: e.target.value });
  };

  componentDidMount() {
    console.log("hello");

    const url = "/updates_name_record/get";
    const self = this;

    axios({
      method: "get",
      url: url,
      params: {
        date: this.date,
        username: username()
      }
    }).then(function(result) {
      console.log(result.data);
      if (result.data.length < 1) {
        self.setState({ projectionist: "" });
      } else {
        if (self.props.updater_shift === true) {
          self.setState({ projectionist: "" });
        } else {
          let arr = {};
          for (let item of result.data) {
            console.log(item);
            arr = item;
          }
          self.setState({ projectionist: arr.name });
          self.props.updater("TRUE");
        }
      }
    });
  }

  sendName = () => {
    if(this.state.name){
      const url = "/updates_name_record";
      const self = this;
  
      axios({
        method: "post",
        url: url,
        data: {
          name: this.state.name,
          date: this.date,
          time: this.time,
          username: username()
        }
      }).then(function(result) {
        self.setState({ projectionist: self.state.name });
        self.props.updater("TRUE");
        self.props.updater("FALSE_SHIFT");
        window.location.reload()
      });
    }
    else{
      message.warning("Please Enter Name")
    }

  };

  empty = () => {
    this.setState({ projectionist: "" });
    this.props.updater("TRUE_SHIFT");
  };

  render() {
    if (this.state.projectionist === "") {
      return (
        <div>
          <div className="row justify-content-center pt-5">
            <div className="card">
              <img
                src="/projectionist.png"
                alt="Star Wars"
                height="230px"
                style={{ borderRadius: "5px 5px 0px 0px" }}
              />

              <div className="card-body">
                <h4 className="card-title">Enter Your Name</h4>
                <div>
                  <label>Your Full Name </label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Don Joe"
                    onChange={e => this.logName(e)}
                    value={this.state.name}
                  />
                  <small class="form-text text-muted">
                    Please enter your full name
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => this.sendName()}
                  class="btn btn-primary btn-block mb-1 mt-4"
                >
                  Enter
                </button>
                <p className="card-text">And have a good day</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="card mb-3" style={{ borderRadius: "0px" }}>
            <div className="card-body">
              <h5 style={{ display: "inline" }}>
                {" "}
                <b> Hello {this.state.projectionist} </b>{" "}
              </h5>
              <p
                style={{ cursor: "pointer", color: "blue", float: "right " }}
                onClick={() => this.empty()}
              >
                Not {this.state.projectionist} Click Here
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return { updater_shift: state.Updater_Shift };
};

const updater = dispatch => {
  return {
    updater: value => {
      dispatch({
        type: value
      });
    }
  };
};

export default connect(
  mapStateToProps,
  updater
)(UserHeader);
