import React, { Component } from "react";
import Jumbotron from "../../New Components/Jumbotron/jumbotron";
import { Card, Table, Tag, message, Modal, Divider } from "antd";
import Formjs from "../Form/form";
import SelectInput from "../Form/Inputs/select";
import { connect } from "react-redux";
import axios from "axios";
import Header from "../Page Header/header";
import DatePickerInput from "../Form/Inputs/date";
import updater from "../../Function/updater";
import username from "../../Function/username";

class Profile extends Component {
  // ! State
  state = {
    key: "tab1",
    noTitleKey: "general",
    phones_numbers: [],
    movies: [],
    storage: []
  };

  // ! Component Did Mount
  // basicly take evrything and put in in state, from local storage
  componentDidMount() {
    let self = this;
    // get phones and passwords
    let url_pnp = "/phones_passwords";
    axios({
      method: "get",
      url: url_pnp,
      params: {
        username: username()
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ phones_numbers: response.data });
    });

    // movies for storage adding
    // takes the movies from redux and set state them
    let movies = [];
    for (let item of this.props.movies) {
      let obj = {};

      console.log(item.title);

      obj.value = item.title;
      obj.label = item.title;

      movies.push(obj);
    }
    this.setState({ movies: movies });
  }

  // ! On Tab Change
  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  // ! Tabs Labels and Keys
  tabListNoTitle = [
    {
      key: "updates_history",
      tab: "Updates History"
    },
    {
      key: "pnp",
      tab: "Phones & Passwords"
    }
    // {
    //   key: "storage",
    //   tab: "Storage"
    // }
  ];

  // ! Table Columns
  // storage
  columns_STR = [
    {
      title: "Title",
      dataIndex: "title",
      render: text => {
        return <b> {text} </b>;
      }
    },
    {
      title: "Remove",
      dataIndex: "remove",
      render: (remove, index) => {
        return (
          <Tag color="red" onClick={() => this.showConfirm_STR(index)}>
            {" "}
            Remove{" "}
          </Tag>
        );
      }
    }
  ];

  // Phones and Passwords
  columns_PNP = [
    {
      title: "Name / Username",
      dataIndex: "name"
    },
    {
      title: "Phone / Password",
      dataIndex: "password"
    },
    {
      title: "Role / Usage",
      dataIndex: "role"
    },
    {
      title: "Tag",
      dataIndex: "tag",
      render: tag => {
        return (
          <Tag color={tag === "Phone" ? "red" : "blue"} key={tag}>
            {" "}
            {tag}
          </Tag>
        );
      }
    },
    {
      title: "Remove",
      dataIndex: "remove",
      render: (text, index) => {
        return (
          <p
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => this.showConfirm(index)}
          >
            {" "}
            Remove{" "}
          </p>
        );
      }
    }
  ];

  // ! Data Selected
  selected;
  getData = (value, name) => {
    console.log(value);
    this.selected = value;
  };

  // ! Send Form Phones and Passwords
  sendForm = () => {
    let new_data = [...this.state.phones_numbers];
    let data = document.getElementById("phones_passwords").elements;
    let obj = {};

    obj.key = new_data.length + 1;
    obj.name = data[0].value;
    obj.pp = data[1].value;
    obj.ru = data[2].value;
    obj.tag = data[3].value;
    obj.remove = new_data.length + 1;

    let self = this;
    axios({
      method: "get",
      url: "/phones_passwords/add",
      params: {
        username: username(),
        name: obj.name,
        password: obj.pp,
        role: obj.ru,
        tag: obj.tag
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ phones_numbers: response.data });
      message.success("Item Added", 1);
    });
  };

  // ! Send Form Storage
  selected;
  saveData = e => {
    this.selected = e;
  };

  sendForm_str = () => {
    // calls a function that add an update
    updater(`Added ${this.selected} to storage`);

    if (this.selected) {
      //if you selected a movie
      let self = this;
      axios({
        method: "post",
        url: "/storage/add",
        data: {
          username: username(),
          title: this.selected
        }
      }).then(function(response) {
        console.log(response.data);
        self.setState({ storage: response.data });
        message.success("Item Added", 1);
      });
    }
  };

  // ! Modal
  confirm = Modal.confirm;
  // phones and stuff
  showConfirm = value => {
    let self = this;
    this.confirm({
      title: "Are you sure you want to delete this item ?",
      onOk() {
        self.removeItem(value);
      }
    });
  };
  // phones and stuff
  showConfirm_STR = value => {
    let self = this;
    this.confirm({
      title: "Are you sure you want to delete this item ?",
      onOk() {
        self.removeItem_STR(value);
      }
    });
  };

  // ! Remove From Phones and Passwords Form
  removeItem = value => {
    let self = this;
    axios({
      method: "get",
      url: "/phones_passwords/remove",
      params: {
        id: value.id,
        username: value.username
      }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ phones_numbers: response.data });
      message.success("Item Removed", 1);
    });
  };

  other_columns = [
    {
      title: "Updater",
      dataIndex: "projectionist"
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, index) => {
        switch (index.type) {
          case 2:
            return <Tag color="purple">Schedule</Tag>;
          case 3:
            return <Tag color="magenta">Key</Tag>;
          case 4:
            return <Tag color="orange">Lights</Tag>;
          case 5:
            return <Tag color="geekblue">Theater</Tag>;
          case 6:
            return <Tag color="volcano">Movie</Tag>;
          default:
            break;
        }
      }
    },
    {
      title: "Name Of Update",
      dataIndex: "title"
    }
  ];

  search_columns = [
    {
      title: "Updater",
      dataIndex: "projectionist"
    },
    {
      title: "Title",
      dataIndex: "title"
    },
    {
      title: "Time Updated",
      dataIndex: "time"
    },
    {
      title: "Theater",
      dataIndex: "t_number",
      render: (text, index) => {
        return <p> {text} </p>;
      }
    },
    {
      title: "Started At",
      dataIndex: "starting_time",
      render: (text, index) => {
        return <p>{text}</p>;
      }
    },
    {
      title: "Theater Temp",
      dataIndex: "t_temp",
      render: (text, index) => {
        return <p>{text}°C</p>;
      }
    },
    {
      title: "Projector Temp",
      dataIndex: "p_temp",
      render: (text, index) => {
        return <p>{text}°C</p>;
      }
    },

    {
      title: "Sound",
      dataIndex: "sound",
      render: (text, index) => {
        switch (index.type) {
          case 1:
            if (text === 0) {
              return <Tag color="red">Problem</Tag>;
            }
            return <Tag color="green">Clear</Tag>;
          default:
            break;
        }
      }
    },
    {
      title: "Picture",
      dataIndex: "picture",
      render: (text, index) => {
        switch (index.type) {
          case 1:
            if (text === 0) {
              return <Tag color="red">Problem</Tag>;
            }
            return <Tag color="green">Clear</Tag>;
          default:
            break;
        }
      }
    },
    {
      title: "Lights",
      dataIndex: "lights",
      render: (text, index) => {
        switch (index.type) {
          case 1:
            if (text === 0) {
              return <Tag color="red">Problem</Tag>;
            }
            return <Tag color="green">Clear</Tag>;
          default:
            break;
        }
      }
    },
    {
      title: "Focus",
      dataIndex: "focus",
      render: (text, index) => {
        switch (index.type) {
          case 1:
            if (text === 0) {
              return <Tag color="red">Problem</Tag>;
            }
            return <Tag color="green">Clear</Tag>;
          default:
            break;
        }
      }
    },
    {
      title: "Fixed",
      dataIndex: "fixed",
      render: (text, index) => {
        switch (text) {
          case 0:
            return <Tag color="red">Not</Tag>;
          case 1:
            return <Tag color="green">Fixed</Tag>;
          default:
            break;
        }
      }
    }
  ];

  getData = e => {
    console.log(e);

    let date = e;
    const self = this;
    axios({
      method: "get",
      url: "/updates/all",
      params: {
        username: username(),
        date: date
      }
    }).then(function(response) {
      console.log(response.data);

      let type_1 = [];
      let type_else = [];
      let type_7 = [];

      for (let item of response.data) {
        if (item.type === 1) {
          type_1.push(item);
        } else if (item.type === 7) {
          type_7.push(item);
        } else {
          type_else.push(item);
        }
      }

      self.setState({ search_data: type_1 });
      self.setState({ other_data: type_7 });
      self.setState({ other_data: type_else });
    });
  };

  // ! Render
  //  all the tabs content is here cuz of state, if you change the state for thing outside the render it wont show on dom.
  // changes wont show on dom if content is not in render
  render() {
    // ! Tabes data
    let contentListNoTitle = {
      updates_history: (
        // General
        <div>
          <div className="row">
            <div className="col-6 ">
              <h4>Update History</h4>
              <p>
                Here you can search the updates of a specific date. <br />
                Fell free to look as far in history as you want.
                <br />
                Know that you will not get any results from the date{" "}
                <b>13/05/2019</b> and back.
              </p>
              {/* Projector Temperature */}
              <div class="form-group row">
                <div className="col-6 mt-2">
                  <DatePickerInput
                    label="Select Date"
                    name="proj_temp"
                    placeholder="Projector Temperature (20,30,40)"
                    value={this.state.history_date}
                    data={e => this.getData(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <h5 className="mb-0"> Movie Updates </h5>
          <p>All the movie updates for the day </p>
          <Table
            dataSource={this.state.search_data}
            columns={this.search_columns}
            size="small"
            pagination={false}
            expandedRowRender={record => (
              <div>
                <p style={{ margin: 0 }}>
                  {[record.notes] == "" ? (
                    <p>No Notes</p>
                  ) : (
                    <p>
                      <b>General Notes :</b> {record.notes}
                    </p>
                  )}
                </p>
                <p style={{ margin: 0 }}>
                  {[record.additional_notes] == "" ? (
                    <p>No Extra Notes</p>
                  ) : (
                    <p>
                      <b>Extra Notes (about problems) :</b>{" "}
                      {record.additional_notes}
                    </p>
                  )}
                </p>
              </div>
            )}
          />

          <h5 className="mb-0 mt-3"> Updates </h5>
          <p>List of all the other updates</p>
          <Table
            columns={this.other_columns}
            dataSource={this.state.other_data}
            size="small"
            pagination={false}
            expandedRowRender={record => (
              <div>
                <p style={{ margin: 0 }}>
                  {[record.notes] == "" ? (
                    <p>No Notes</p>
                  ) : (
                    <p>
                      <b>General Notes :</b> {record.notes}
                    </p>
                  )}
                </p>
                <p style={{ margin: 0 }}>
                  {[record.additional_notes] == "" ? (
                    <p>No Extra Notes</p>
                  ) : (
                    <p>
                      <b>Extra Notes (about problems) :</b>{" "}
                      {record.additional_notes}
                    </p>
                  )}
                </p>
              </div>
            )}
          />
        </div>
      ),

      // Phones and Passwords
      pnp: (
        <div>
          <h4 className="m-0">Phones And Passwords</h4>
          <small>All the important phones and passwords</small>
          <br />
          <br />
          <Table
            columns={this.columns_PNP}
            dataSource={this.state.phones_numbers}
            size="middle"
          />
          <br />
          <h4> Add New Phone / Password</h4>
          <form id="phones_passwords">
            <div class="form-group">
              <label>Name / Username</label>
              <input
                type="text"
                name="name"
                placeholder="Name or username"
                className="form-control"
              />
            </div>
            <div class="form-group">
              <label>Phone / Password</label>
              <input
                type="text"
                name="password"
                placeholder="050-4373998 / KLPRJ"
                className="form-control"
              />
            </div>
            <div class="form-group">
              <label>Role / Usage</label>
              <input
                type="text"
                name="Role"
                placeholder="Manager, Projector Password, Emploee"
                className="form-control"
              />
            </div>
            <div class="form-group">
              <label>Tag</label>
              <input
                type="text"
                name="tag"
                placeholder="Phone / Password (Capital Required For Color)"
                className="form-control"
              />
            </div>
          </form>
          <button
            onClick={this.sendForm}
            type="button"
            class="btn btn-outline-dark"
          >
            Add To List
          </button>
        </div>
      )
    };

    return (
      <div>
        <Header
          title={`${username()} Profile`}
          content={
            <div>
              <h5>
                Here you can edit the general information on the theater, add
                phones <br />
                and passwords, manage the storage at the specific theater
              </h5>
            </div>
          }
          color="#FF8984"
        />

        <Card
          className="mt-3"
          style={{ width: "100%" }}
          tabList={this.tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, "noTitleKey");
          }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}

// ! REDUX
const mapStateToProps = state => {
  return { movies: state.All_Movies };
};

export default connect(
  mapStateToProps,
  null
)(Profile);
