import React, { Component } from "react";
import {
  Table,
  Divider,
  Tag,
  Badge,
  Drawer,
  Button,
  Icon,
  Checkbox,
  Progress,
  message,
  Popconfirm,
  Modal
} from "antd";
import UpdateInfo from "./daily_updates";
import Formjs from "../Form/form";
import axios from "axios";
import Header from "../Page Header/header";
import username from "../../Function/username";

export default class HomeTable extends Component {
  // ! Date and time
  // just dont touch this...
  d = new Date();
  date =
    this.d.getDate() +
    "-" +
    (this.d.getMonth() + 1) +
    "-" +
    this.d.getFullYear();

  progress_date =
    this.d.getFullYear() +
    "-" +
    (this.d.getMonth() + 1) +
    "-" +
    this.d.getDate();

  time =
    this.d.getHours() + ":" + this.d.getMinutes() + ":" + this.d.getSeconds();

  // ! State
  state = {
    visible: false,
    progress_percent: 0,
    progress_prompt: "",
    data: []
  };

  // ! Componenet did mount
  componentDidMount() {
    if (localStorage.getItem("progress")) {
      this.setState({ progress_percent: localStorage.getItem("progress") });
    }

    const date = new Date();
    const date_date = String(
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
    const self = this;
    const url = "/schedule";
    axios({
      method: "get",
      url: url,
      params: {
        date: date_date,
        username: username()
      }
    }).then(function(response) {
      console.log(response.data);
      if (response.data.length > 1) {
        self.setState({
          data: response.data
        });
      } else {
        localStorage.setItem("progress", "")
        message.warning("Please fill today's schedule", 1);
      }
    });
  }

  // ! Modal
  // modal that get executed when there is a problem with one of the paremeters in the daily update derawr
  confirm = Modal.confirm;
  extraNotesModal = content => {
    const self = this;
    this.confirm({
      title: "Did something went wrong ?",
      content: (
        <div>
          <p>
            Looks like you didn't check something or the temperature was a bit
            low.
          </p>
          <p>
            <b> {content} </b>
          </p>
          <label>Did You Fix The Problem</label>
          <br />
          <Checkbox
            name="fixed"
            onChange={e => this.checkedValue(e)}
            // checked={this.state.fixed}
          >
            {" "}
            <b>Yes</b>{" "}
          </Checkbox>
          <small class="form-text text-muted">You or anyone else</small>
          <br />
          <label>What Went Wrong</label>
          <textarea
            name="additional_notes"
            class="form-control"
            placeholder="The lights in the theater were a bit dim / The sound was off but we fixed it"
            // value={this.state.additional_notes}
            onChange={e => this.inputValue(e)}
          />
          <small class="form-text text-muted">
            Describe the problem the best you can, if you fixed the problem write it down too, if not write why.
          </small>
          <br />
        </div>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        self.submit();
      },
      onCancel() {
        self.setState({ additional_notes: "", fixed: false });
      }
    });
  };

  // ! Submit Gate
  // cheacks if there is a problem with one of the paremeters in the daily update derawr
  // if true execute modal
  submitGate = () => {
    const {
      key,
      title,
      poster,
      theater,
      starts,
      theater_temp,
      proj_temp,
      notes,
      sound,
      picture,
      lights,
      focus,
      additional_notes,
      fixed
    } = this.state;

    if (theater_temp === "" || proj_temp === "") {
      message.warning(
        "Must fill theater temp and projector temp before submitting"
      );
      return;
    }

    let arr = [];

    if (theater_temp < 10) {
      arr.push(<p className="mb-0">Theater Temperature</p>);
    }
    if (proj_temp < 10) {
      arr.push(<p className="mb-0">Projector Temperature</p>);
    }
    if (sound === false) {
      arr.push(<p className="mb-0">Sound</p>);
    }
    if (picture === false) {
      arr.push(<p className="mb-0">Picture</p>);
    }
    if (lights === false) {
      arr.push(<p className="mb-0">Lights</p>);
    }
    if (focus === false) {
      arr.push(<p className="mb-0">Focus</p>);
    }
    if (arr.length > 0) {
      this.extraNotesModal(arr);
    } else {
      this.submit();
    }
  };

  // ! Submit
  // submits to database
  submit = () => {
    const self = this;
    const {
      key,
      title,
      poster,
      theater,
      starts,
      theater_temp,
      proj_temp,
      notes,
      sound,
      picture,
      lights,
      focus,
      additional_notes,
      fixed
    } = this.state;

    let d = new Date();
    let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    console.log(time);
    console.log(date);

    const url = "/daily";
    axios({
      method: "post",
      url: url,
      data: {
        type: 1,
        active_key: key,
        username: username(),
        date: date,
        time: time,
        title: title,
        poster: poster,
        theater: theater,
        starts: starts,
        theater_temp: theater_temp,
        proj_temp: proj_temp,
        notes: notes,
        sound: sound,
        picture: picture,
        lights: lights,
        focus: focus,
        additional_notes: additional_notes,
        fixed: fixed
      }
    }).then(function(result) {
      let data = result.data;
      console.log(data);
      
     
      self.setState({
        visible: false,
        data : data
      });
      self.progress();
      message.success("Movie updated successfully");
    });
  };

  // ! Progress bar
  progress = () => {
    let __updated = JSON.parse(localStorage.getItem("updated"));
    const updated = __updated.length;
    const list = this.state.data.length;
    let percent = (updated / list) * 100;
    localStorage.setItem("progress", Math.ceil(percent));
    this.setState({ progress_percent: Math.ceil(percent) });
  };

  // ! Update drawer
  update = e => {
    this.showDrawer();
    console.log(e.id);
    this.setState({
      key: e.id,
      title: e.title,
      poster: e.poster,
      theater: e.theater,
      starts: e.starts,
      theater_temp: "",
      proj_temp: "",
      notes: "",
      sound: false,
      picture: false,
      lights: false,
      focus: false,
      additional_notes: "",
      fixed: false
    });
  };

  // ! Input value
  // handels the text inputs
  inputValue = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
    console.log(this.state);
  };

  // ! Cheackbox value
  // handels the cheackboxes inputs
  checkedValue = e => {
    let name = e.target.name;
    let value = e.target.checked;
    this.setState({ [name]: value });
    console.log(this.state);
  };

  // ! Open drawer
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  // !  Close drawer
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  // !  Colomns for table
  columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: poster => (
        <span>
          <img src={poster} alt="" height="50" />
        </span>
      )
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Theater",
      dataIndex: "theater",
      key: "theater",
      render: text => <p> Theater {text} </p>
    },
    {
      title: "Starts at",
      dataIndex: "starts",
      render: starts => <b> {starts} </b>
    },
    // {
    //   title: "Brake",
    //   dataIndex: "brake",
    //   key: "brake"
    // },
    // {
    //   title: "Ends at",
    //   dataIndex: "end",
    //   key: "end"
    // },
    {
      title: "Action",
      key: "action",
      render: (text, index) => {
        // if (localStorage.getItem("updated")) {
        if (index.type) {
          return (
            <Tag color="green" key={index.id}>
              UPDATED
            </Tag>
          );
        }
        // }
        else {
          return (
            <a onClick={() => this.update(index)} href="javascript:;">
              Update {index.title}
            </a>
          );
        }
      }
    }
  ];

  // // ! Prompt for progrees
  // // just for fun
  // prompt = p => {
  //   console.log(p);

  //   if (p === 0) {
  //     return "Do you think you can do this ?";
  //   } else if (p > 10 && p < 20) {
  //     return "10%... Pathetic";
  //   } else if (p > 20 && p < 30) {
  //     return " Good Job ! You Got To 20%... loser ";
  //   } else if (p > 30 && p < 35) {
  //     return " 30% is ok I guess ";
  //   } else if (p > 35 && p < 40) {
  //     return " Ok..";
  //   } else if (p > 40 && p < 50) {
  //     return " Ok.. fine, you're better than i thought";
  //   } else if (p > 50 && p < 60) {
  //     return "Alright ! 50% dude";
  //   } else if (p > 60 && p < 70) {
  //     return "Almost there man ! Don't quit on me ";
  //   } else if (p > 70 && p < 80) {
  //     return "Hell Yeah ! Just Push On ";
  //   } else if (p > 80 && p < 85) {
  //     return "PUSH PUSH PUSH PUSH PUSH";
  //   } else if (p > 85 && p < 90) {
  //     return "OMG I CANNOT believe  we are here ";
  //   } else if (p > 90 && p < 100) {
  //     return "I want to thank my mom and my dad";
  //   } else if (p === 100) {
  //     return "Done";
  //   }
  // };

  // ! Render
  render() {
    if (this.props.data) {
      if (!localStorage.getItem("progress")) {
        if (localStorage.getItem("updated")) {
          this.progress();
        }
      }
    }
    return (
      <div>
        <Header
          title="Update Movies And Schedule"
          content={
            <div>
              <h5>
                Here you can update the movie (Sound check, Temperatures, and
                more) <br /> You can see your progress on the progress bar down
                here.
              </h5>
              {/* <br />
              <p className="m-0"> Update Progress </p>
              <p className="m-0" style={{ fontSize: "11px" }}>
                {this.prompt(this.state.progress_percent)}
              </p> */}
              {/* <Progress
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068"
                }}
                percent={this.state.progress_percent}
                status="active"
              /> */}
            </div>
          }
          color="#FFEB3B"
        />

        <Table
          className="mt-3"
          columns={this.columns}
          dataSource={this.state.data}
          size="middle"
        />
        <Drawer
          placement="left"
          title={`Update ${this.state.title}`}
          width={500}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <div className="row pb-2">
            <div className="col-6">
              <img
                src={this.state.poster}
                alt={this.state.title}
                height="300"
                width="200"
              />
            </div>

            <div className="col-6">
              <h4>{this.state.title}</h4>

              <p className="m-0">
                <b>Theater Number : </b>
                {this.state.theater}
              </p>
              <p className="m-0">
                <b>Starts At : </b>
                {this.state.starts}
              </p>
              <p className="m-0">
                <b>Language : </b>English
              </p>
              <p className="m-0">
                <b>Subtitles : </b>English
              </p>
              <p className="m-0">
                <b>Lens : </b>Flat
              </p>
              <p className="m-0">
                <b>Format : </b>2D
              </p>
              <p className="m-0">
                <b>Key Expired : </b>2019-04-09T21:00:00.000Z
              </p>
              <small
                style={{ position: "absolute", bottom: "0" }}
                className="pr-4"
              >
                <b>Date: </b>
                {`${this.date}, ${this.time}`}
              </small>
            </div>
          </div>

          <hr />

          <h4 className="m-0"> Daily Movie Update </h4>
          <small>Update this for every movie</small>
          <br />
          <br />

          <form>
            {/* Theater Temperature */}
            <div class="form-group">
              <label>Theater Temperature</label>
              <input
                type="number"
                name="theater_temp"
                class="form-control"
                placeholder="Theater Temperature (20,30,40)"
                value={this.state.theater_temp}
                onChange={e => this.inputValue(e)}
              />
            </div>
            {/* Projector Temperature */}
            <div class="form-group">
              <label>Projector Temperature</label>
              <input
                type="number"
                name="proj_temp"
                class="form-control"
                placeholder="Projector Temperature (20,30,40)"
                value={this.state.proj_temp}
                onChange={e => this.inputValue(e)}
              />
            </div>
            {/* Notes */}
            <div class="form-group">
              <label>Notes</label>
              <input
                type="textarea"
                name="notes"
                class="form-control"
                placeholder="Anything freaky happened ? , write it here"
                value={this.state.notes}
                onChange={e => this.inputValue(e)}
              />
            </div>
            <Checkbox
              name="sound"
              onChange={e => this.checkedValue(e)}
              checked={this.state.sound}
            >
              {" "}
              Sound Test{" "}
            </Checkbox>
            <Checkbox
              name="picture"
              onChange={e => this.checkedValue(e)}
              checked={this.state.picture}
            >
              {" "}
              Picture Test{" "}
            </Checkbox>
            <Checkbox
              name="lights"
              onChange={e => this.checkedValue(e)}
              checked={this.state.lights}
            >
              {" "}
              Lights Test{" "}
            </Checkbox>
            <Checkbox
              name="focus"
              onChange={e => this.checkedValue(e)}
              checked={this.state.focus}
            >
              {" "}
              Focus Test{" "}
            </Checkbox>
          </form>
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
            <Button onClick={this.submitGate} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}
