import React, { Component } from "react";
import axios from "axios";
import SelectInput from "../Form/Inputs/select";
import Text from "../Form/Inputs/text";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
class Login extends Component {
  componentDidMount() {
    let url = "/users";

    axios.get(url).then(res => {
      console.log(res.data);
      this.setState({ users: res.data });
    });
  }

  theater_name;
  password;

  checkbox = e => {
    console.log(`checked = ${e.target.checked}`);
    this.setState({ checked: e.target.checked });
  };

  getData(value, name) {
    if (name === "theater_name") {
      this.theater_name = value;
    } else if (name === "password") {
      this.password = value;
      this.setState({ password: value });
    }
    console.log(this.theater_name, this.password);
  }

  submit = () => {
    const url = "/login";

    axios({
      method: "get",
      url: url,
      params: {
        theater_name: this.theater_name,
        password: this.password
      }
    })
      .then(response => {
        console.log(response);

        switch (response.data.bol) {
          case "user":
            console.log("Please Pick User");
            this.setState({ prompt: "Please Pick User" });
            this.setState({ style: { color: "orange" } });
            console.log(this.state);
            this.props.login("user");
            break;

          case "password":
            console.log("Please Fill Password");
            this.setState({ style: { color: "orange" } });
            this.setState({ prompt: "Please Fill Password" });
            this.props.login("password");
            break;

          case false:
            console.log("Wrong Password");
            this.setState({ style: { color: "red" } });
            this.setState({ prompt: "Incorrect Password" });
            this.props.login(false);
            break;

          case true:
            console.log("Loging in");
            this.setState({ style: { color: "#20B245" } });
            this.setState({ prompt: "Loging in" });
            this.props.login(true);
            if (this.state.checked === true) {
              localStorage.setItem("username", this.theater_name);
            } else {
              sessionStorage.setItem("username", this.theater_name);
            }
            localStorage.setItem("theaters", response.data.theaters_number);
            console.log(response);

            break;

          default:
            console.log("Login");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  state = {
    users: [],
    prompt: "Welcome to Projector Helper",
    style: { color: "gray" }
  };

  render() {
    return (
      <div>
        <div className="row justify-content-center pt-5">
          <div className="col-6">
            <div className="card">
              <img
                src="/Login.png"
                alt="Star Wars"
                height="230px"
                style={{ borderRadius: "5px 5px 0px 0px" }}
              />
              <div className="card-body">
                <h4 className="card-title">Login</h4>
                <h6 className="card-subtitle mb-4" style={this.state.style}>
                  {this.state.prompt}
                </h6>
                <SelectInput
                  options={this.state.users}
                  label="Theater Name"
                  data={(value, name) => this.getData(value, name)}
                  name="theater_name"
                />
                <Text
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="Password"
                  data={(value, name) => this.getData(value, name)}
                  value={this.state.password}
                />
                <div className="mt-4 mb-2">
                  <Checkbox onChange={e => this.checkbox(e)}>
                    Remember me
                  </Checkbox>
                  <a
                    style={{ float: "right" }}
                    className="login-form-forgot"
                    href=""
                  >
                    Forgot password
                  </a>
                </div>

                <button
                  type="button"
                  onClick={this.submit}
                  class="btn btn-primary btn-block mb-1"
                >
                  Login
                </button>
                <p className="card-text">
                  Please log in to the correct theater location, can't see
                  yourself on the list,
                  <br />
                  <a href="/register">Register Now </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Log_In = dispatch => {
  return {
    login: login => {
      dispatch({
        type: "LOGIN",
        payload: login
      });
    }
  };
};

export default connect(
  null,
  Log_In
)(Login);
