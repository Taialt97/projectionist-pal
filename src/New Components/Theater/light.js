import { Drawer, List, Avatar, Divider, Col, Row, Form, Button, message } from "antd";
import React, { Component } from "react";
import axios from "axios";
import SelectInput from "../Form/Inputs/select";
import Text from "../Form/Inputs/text";
import { connect } from "react-redux";
import { Icon } from "antd";
import Formjs from "../Form/form";
import update from "../../Function/updater"
import username from "../../Function/username";
class Light extends Component {
  state = {
    theater: 1,
    visible: false,
    prompt: "Update information of theater number " + this.props.theater,
    update: "",
    form: {date:""}
  };

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

  componentDidMount() {
    this.getLightInfo();
  }

  getLightInfo = () => {
    const url = "/theater/light";
    let self = this;

    axios({
      method: "get",
      url: url,
      params: {
        username: username(),
        theater: this.props.theater
      }
    }).then(function(result) {
      if (result.data[0]) {
        self.setState({ form: result.data[0] });
      } else {
        let data = {
          id: 0,
          username: username(),
          type: "",
          serial: "",
          max_light: "",
          light_on: "",
          date: "",
          reason: "",
          exploitation: "",
          theater_number: self.props.theater
        };
        self.setState({ form: data });
      }

      console.log(self.state);
    });
  };

  updateLightInfo = () => {  

    update(4,"Updated the light",
     `In Theater: ${this.state.form.type},      
     Type: ${this.state.form.type}, 
     Serial Number : ${this.state.form.type}, 
     Max Light Usage: ${this.state.form.type}, 
     Light Usage : ${this.state.form.type}, 
     Last Updated: ${this.state.form.type}, 
     Reason: ${this.state.form.type}, 
     Exploitation In WATT: ${this.state.form.type}, 
     `
     )

    const url = "/theater/light/update";
    let self = this;

    axios({
      method: "post",
      url: url,
      data: this.state.form
    }).then(function(result){
      self.setState({ form : result.data })
      self.onClose()
      message.success("successfully updated the light information")
    })
  };

  onChange = e => {
    console.log(e.target.value);

    let form = {...this.state.form}

    const name = e.target.name;
    const value = e.target.value;

    form[name] = value

    this.setState({ form : form});
  };

  theater = this.props.theater;
  render() {
    console.log(this.state);
    console.log(this.props.theater);
    if (this.theater !== this.props.theater) {
      this.getLightInfo();
      this.theater = this.props.theater;
    }

    const color = () => {
      if (this.state.form.id === 0) {
        return { color: "orange", borderColor: "orange" };
      }
      return;
    };

    const {
      id,
      username,
      type,
      serial,
      max_light,
      light_on,
      date,
      reason,
      exploitation,
      theater_number
    } = this.state.form;

    return (
      <div>
        <div className="card" style={color()}>
          <div className="card-body">
            <div>
              <Icon type="bulb" style={{ fontSize: "18px", float: "left" }} />
              <div className="ml-3" style={{ float: "left" }}>
                <h4 style={color()} className="mb-0">
                  {" "}
                  Light Information{" "}
                </h4>
                <p className="mb-0">
                  Click on more information to see and update the light
                  information
                </p>
              </div>
            </div>
            <a
              onClick={this.showDrawer}
              style={{
                float: "right",
                verticalAlign: "middle",
                lineHeight: "38px",
                color: "#006BFF"
              }}
            >
              View And Update Information
            </a>
          </div>
        </div>
        <Drawer
          width={640}
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <h3 className="mb-0"> Light Information </h3>
          <p> All light information </p>
          <hr />
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}> Type : </span>
            {type}
          </p>
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}> Serial Number : </span>
            {serial}
          </p>
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}> Max Light Usage : </span>
            {max_light}
          </p>
          <p>
            {" "}
            <span
              style={
                light_on > 2000
                  ? { fontWeight: "bold", color: "orange" }
                  : { fontWeight: "bold" }
              }
            >
              {" "}
              Light Usage :{" "}
            </span>
            {light_on}
          </p>
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}> Last Changed : </span>
            {date}
          </p>
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}> Reason : </span>
            {reason}
          </p>
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}> Exploitation In WATT : </span>
            {exploitation}
          </p>
          <hr />
          <h3 className="mb-0 mt-5"> Update Information </h3>
          <p> {this.state.prompt} </p>

          <form>
            {/* Theater Number */}
            <div class="form-group">
              <label>Theater Number</label>
              <input
                name="theater"
                type="text"
                class="form-control"
                placeholder="Theater number"
                value={this.props.theater}
                disabled={true}
              />
              {/* <small class="form-text text-muted">
                We'll never share your email with anyone else.
              </small> */}
            </div>

            {/* Type */}
            <div class="form-group">
              <label>Type</label>
              <input
                type="text"
                name="type"
                class="form-control"
                placeholder="Resembles : CDXL-16M"
                value={this.state.form.type}
                onChange={e => this.onChange(e)}
              />
              {/* <small class="form-text text-muted">
                We'll never share your email with anyone else.
              </small> */}
            </div>

            {/* Serial Number< */}
            <div class="form-group">
              <label>Serial Number</label>
              <input
                type="text"
                name="serial"
                class="form-control"
                placeholder="Resembles : LAVEB430P"
                value={this.state.form.serial}
                onChange={e => this.onChange(e)}
              />
              {/* <small class="form-text text-muted">
                We'll never share your email with anyone else.
              </small> */}
            </div>

            {/* Max Light Usage< */}
            <div class="form-group">
              <label>Max Light Usage</label>
              <input
                type="number"
                name="max_light"
                class="form-control"
                placeholder="Max hours light should be used"
                value={this.state.form.max_light}
                onChange={e => this.onChange(e)}
              />
              {/* <small class="form-text text-muted">
                We'll never share your email with anyone else.
              </small> */}
            </div>

            {/* Light Usage (Light Bulb)< */}
            <div class="form-group">
              <label style={{ color: "orange" }}>
                Light Usage (Light Bulb)
              </label>
              <input
                type="number"
                name="light_on"
                class="form-control"
                placeholder="How many hours did you use the light"
                value={this.state.form.light_on}
                style={{ borderColor: "orange" }}
                onChange={e => this.onChange(e)}
              />
              <small class="form-text text-muted">
                You can find it in the (look up the name)
              </small>
            </div>

            {/* Last Changed< */}
            <div class="form-group">
              <label>Last Changed</label>
              <input
                type="text"
                name="date"
                class="form-control"
                placeholder="When did you last changed the light bulb"
                value={(this.state.form.date) ? this.state.form.date.substring(0, 10) : ""}
                disabled={true}
              />
              <small class="form-text text-muted">
                Will change when you submit the form
              </small>
            </div>

            {/* Changing Reason< */}
            <div class="form-group">
              <label>Changing Reason</label>
              <input
                type="text"
                name="reason"
                class="form-control"
                placeholder="Why did you change the light bulb"
                value={this.state.form.reason}
                onChange={e => this.onChange(e)}
              />
            </div>

            {/* Exploitation In WATT< */}
            <div class="form-group">
              <label>Exploitation In WATT</label>
              <input
                type="text"
                name="exploitation"
                class="form-control"
                placeholder="Percentage"
                value={this.state.form.exploitation}
                onChange={e => this.onChange(e)}
              />
            </div>
          </form>
          <br />
          <br />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={() => this.updateLightInfo()} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    theater: state.Theaters_Nav_Number.theater_number
  };
};

export default connect(
  mapStateToProps,
  null
)(Light);
