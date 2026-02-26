import React, { Component } from "react";
import Form from "../Form/form";
import { Modal, Button, notification, message } from "antd";
import axios from "axios";

export default class Register extends Component {
  state = {
    users: [],
    prompt: "Register",
    style: { color: "gray" },
    username: "",
    amount: "",
    password: "",
    con_password: "",
    ok: false
  };

  componentDidMount() {
    const url = "/users/all";
    let self = this;
    axios({
      method: "get",
      url: url
    }).then(function(response) {
      console.log(response.data);
      let data = [];
      for (let item of response.data) {
        data.push(item.username.toUpperCase());
      }
      self.setState({ users: data });
    });
  }

  data = e => {
    if (e.target.name === "username") {
      const users = [...this.state.users];

      if (users.length > 0) {
        for (let item of users) {
          console.log(item);
          if (item === e.target.value.toUpperCase()) {
            console.log("found");
            this.setState({
              prompt: "Username already exists",
              style: { color: "orange" }
            });
          } else {
            this.setState({
              prompt: "Register",
              style: { color: "gray" },
              username: e.target.value
            });
          }
        }
      } else {
        this.setState({
          prompt: "Register",
          style: { color: "gray" },
          username: e.target.value
        });
      }



      
    } else if (e.target.name === "password") {
      if (e.target.value.length < 8) {
        this.setState({
          prompt: "Password is too short (at least 8 characters)",
          style: { color: "orange" }
        });
      } else {
        this.setState({
          prompt: "Register",
          style: { color: "gray" },
          [e.target.name]: e.target.value
        });
      }
    } else if (e.target.name === "con_password") {
      if (this.state.password === e.target.value) {
        this.setState({
          prompt: "Register",
          style: { color: "gray" },
          [e.target.name]: e.target.value
        });
      } else {
        this.setState({
          prompt: "Passwords are not matching",
          style: { color: "orange" }
        });
      }
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  openNotificationWithIcon = type => {
    notification[type]({
      message: <p style={{ marginLeft: "25px" }}> Something's Missing </p>,
      description: "Please fill all the inputs to create the account."
    });
  };

  confirm = Modal.confirm;
  showConfirm = () => {
    let self = this;
    this.confirm({
      title: (
        <div>
          <p className="m-0"> Please Enter The Key Password Here </p>
          <p style={this.state.style}> {this.state.prompt} </p>
        </div>
      ),
      content: (
        <div>
          <br />
          <form>
            <div class="form-group">
              <label>Key Password</label>
              <input
                type="Text"
                class="form-control"
                placeholder="If you don't have the password ask higher management"
                name="keyPass"
                onChange={e => this.data(e)}
              />
              <small class="form-text text-muted">
                The password you should enter here is the "key password" for
                user creation, If you don't have the password ask higher
                management
              </small>
            </div>
          </form>
        </div>
      ),
      onOk() {
        if (self.state.keyPass === "Hot") {
          message.success("User Created");
          let url = "/users/create";
          // Send a POST request
          axios({
            method: "post",
            url: url,
            data: {
              username: self.state.username,
              password: self.state.con_password,
              theaters_number: self.state.amount
            }
          });
          window.location = "http://localhost:3000";
        }
      },
      onCancel() {}
    });
  };

  render() {
    return (
      <div>
        <div className="row justify-content-center pt-5">
          <div className="col-6">
            <div className="card">
              <img
                src="/Register.png"
                alt="Evil Dead"
                height="230px"
                style={{ borderRadius: "5px 5px 0px 0px" }}
              />
              <div className="card-body">
                <h5 className="card-title">Register</h5>
                <h6 className="card-subtitle mb-2" style={this.state.style}>
                  {this.state.prompt}
                </h6>
                <p className="card-text">
                  Already have an account
                  <a href="/"> Login Here </a>
                </p>

                <form id="register">
                  <div class="form-group">
                    <label>Theater Name (Username)</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Karmiel, Hifa, Kefar Sava"
                      name="username"
                      value={this.state.username}
                      onChange={e => this.data(e)}
                    />
                    <small class="form-text text-muted">
                      Name of the location will do best but you can pick any
                      name you want
                    </small>
                  </div>

                  <div class="form-group">
                    <label>Theaters Amount</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="How many theaters in the theater"
                      name="amount"
                      onChange={e => this.data(e)}
                    />
                  </div>

                  <div class="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      name="password"
                      onChange={e => this.data(e)}
                    />
                  </div>

                  <div class="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Confirm Password"
                      name="con_password"
                      onChange={e => this.data(e)}
                    />
                  </div>
                </form>

                <button
                  type="button"
                  class="btn btn-dark btn-block"
                  onClick={
                    this.state.username !== "" &&
                    this.state.amount !== "" &&
                    this.state.password !== "" &&
                    this.state.con_password !== ""
                      ? this.showConfirm
                      : () => this.openNotificationWithIcon("warning")
                  }
                >
                  Make My Account
                </button>
                <small class="form-text text-muted">
                  Make sure you already got the key for the account creation
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// class="btn btn-outline-dark"
