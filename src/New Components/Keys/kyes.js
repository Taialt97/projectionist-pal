import React, { Component } from "react";
import Header from "../Page Header/header";
import { Table, Divider, Tag, Popconfirm, message } from "antd";
import TimePickerInput from "../Form/Inputs/time";
import DatePickerInput from "../Form/Inputs/date";
import axios from "axios";
import { connect } from "react-redux";
import updater from "../../Function/updater";
import username from "../../Function/username";
class Keys extends Component {
  state = {
    data: [],
    form: {}
  };

  componentDidMount() {
    this.setState({ data: this.props.movies });
  }

  poster = input => {
    console.log(input);
    // let poster = this.props.posters.find(function(element) {
    //   return element.title > input.title;
    // });
    for (let item of this.props.posters) {
      if (item.title === input.title) {
        return `/public/uploads/${item.poster}`;
      }
    }
  };

  columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (poster, index) => (
        <span>
          <img src={this.poster(index)} alt="" height="50" />
        </span>
      )
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Date Expiration",
      dataIndex: "key_exp",
    },
    {
      title: "Time Expiration",
      dataIndex: "key_exp_time"
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Popconfirm
            title={
              <div>
                <h5> Update Key Expiration Date</h5>
                <form onSubmit={e => this.updateKey(e)}>
                  <TimePickerInput
                    label="Expiration Time"
                    className="form-control"
                    placeholder="00:00:00"
                    name="key_time"
                    data={e => this.dataCollection(e, "time")}
                  />
                  <DatePickerInput
                    label="Expiration Date"
                    name="key_date"
                    data={e => this.dataCollection(e, "date")}
                  />
                </form>
                <hr className="mb-0" />
              </div>
            }
            trigger="click"
            placement="topLeft"
            onConfirm={() => this.updateKey(record)}
            okText="Update Key"
            cancelText="Cancel"
          >
            <p style={{ color: "red", cursor: "pointer" }}>
              Change Expiration Date
            </p>
          </Popconfirm>
        </span>
      )
    }
  ];

  dataCollection = (e, name) => {
    console.log(this.state.form);

    console.log(e);
    const form = { ...this.state.form };
    form[name] = e;

    this.setState({ form: form });
    console.log(this.state);
  };

  updateKey = e => {
    console.log(this.state.form);

    updater(3,`Updated ${e.title} key`, 
    `Date: ${this.state.form.date} , Time: ${this.state.form.time}`)

    const url = "/key/update";
    const self = this;
    console.log(e);

    axios({
      method: "post",
      url: url,
      data: {
        form: this.state.form,
        item: e,
        username : username()
      }
    }).then(function(result) {
      console.log(result.data);
      self.setState({ data: result.data });
      message.success(`Updated ${e.title} Key`)
    });
  };

  render() {
    return (
      <div>
        {/* import Header from "../Page Header/header"; */}
        <Header
          title="Keys Management"
          content={
            <div>
              <h5>
                Here you can edit the general information on the theater, add
                phones <br />
                and passwords, manage the storage at the specific theater
              </h5>
            </div>
          }
          color="#1e88e5"
        />

        <Table
          className="mt-3"
          size="middle"
          columns={this.columns}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    movies: state.All_Movies,
    posters: state.All_Posters
  };
};

export default connect(
  mapStateToProps,
  null
)(Keys);
