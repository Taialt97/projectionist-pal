import React, { Component } from "react";
import {
  Upload,
  Icon,
  message,
  Button,
  Table,
  Tag,
  Popconfirm,
  notification
} from "antd";
import axios from "axios";
import username from "../../Function/username";
import dateTime from "../../Function/date_time";
import ExplainModal from "./explain";
import { connect } from "react-redux";
import updater from "../../Function/updater";
class Commercials extends Component {
  state = {
    data: [],
    image: "Select Image",
    trailer_image: ""
  };

  columns = [
    {
      title: "Updater",
      dataIndex: "projectionist",
      render: text => <p> {text === null ? "Nothing" : text} </p>
    },
    {
      title: "Title",
      dataIndex: "type"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: text => (
        <Tag color={text === 1 ? "green" : "red"}>
          {" "}
          {text === 1 ? "UPDATED" : "NOT UPDATED"}{" "}
        </Tag>
      )
    }
  ];

  componentDidMount() {
    const url = "/commercials";
    const self = this;
    axios({
      method: "get",
      url: url,
      params: { username: username(), date: dateTime("date").date }
    }).then(function(response) {
      console.log(response.data);
      self.setState({ data: response.data });
    });

    const _url = "/commercials/images";
    axios({
      method: "get",
      url: _url,
      params: { username: username() }
    }).then(function(response) {
      if (response.data[0]) {
        self.setState({
          trailer_image: response.data[0].image,
          updated: response.data[0].updated.substring(0, 10)
        });
      }
    });
  }

  openNotification = () => {
    notification.open({
      message: "Please Upload Image",
      description: `The commercials were updated last at ${this.state.updated.substring(
        0,
        10
      )},
        if you want to update the commercials again upload a new commercials image. `,
      onClick: () => {
        console.log("Notification Clicked!");
      }
    });
  };

  save = () => {
    if (this.state.updated === undefined) {
      message.warning("Please upload image");
      return;
    }

    const updated = this.state.updated.substring(0, 10);
    let MyDateString;

    let MyDate = new Date();

    MyDateString =
      MyDate.getFullYear() +
      "-" +
      ("0" + (MyDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + MyDate.getDate()).slice(-2);

    if (updated !== MyDateString) {
      console.log(updated);
      console.log(MyDateString);

      this.openNotification();
      return;
    }

    const self = this;
    const url = "/commercials/update";
    if (this.state.selectedRows) {
      axios({
        method: "post",
        url: url,
        data: {
          username: username(),
          date: dateTime("date").date,
          movies: this.props.movies.length,
          selected: this.state.selectedRows
        }
      }).then(function(response) {
        console.log(response.data);
        self.setState({ data: response.data });
        self.setState({ selectedRowKeys: [] });
        self.setState({ selectedRows: [] });
      });
    } else {
      message.warning("Please make a selection before saving");
    }
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys, selectedRows: selectedRows });
  };

  selectImage = e => {
    if (e) {
      console.log(e);
      this.setState({ image: e.name });
      this.setState({ file: e });
    }
  };

  uploadImage = () => {
    if (this.state.file) {
      const self = this;
      const url = "/commercials/images/upload";

      let image = new FormData();
      image.append("selectedFile", this.state.file);
      image.append("username", username());
      image.append("date", dateTime("date").date);

      console.log(image);

      axios({
        method: "post",
        url: url,
        data: image
      }).then(function(result) {
        console.log(result.data);

        console.log(result.data.image[0].image);
        console.log(result.data.image[0].updated);
        console.log(result.data.updated);

        let image = result.data.image[0].image;
        let updated = result.data.image[0].updated;
        let _data = result.data.updated;

        self.setState({
          trailer_image: image,
          updated: updated,
          data: _data
        });
      });
    } else {
      message.warning("No picture selected");
      return;
    }
    message.success("Picture Updated");
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div>
        <div className="row">
          <div className="col-8">
            <img
              src={`/public/uploads/${
                this.state.trailer_image
              }`}
              alt="Capture"
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-4 pl-0">
            <h5 className="mb-0"> Commercials List </h5>
            <p> Check what you updated. Don't forget to save </p>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={this.state.data}
              size="small"
              pagination={false}
            />

            <Popconfirm
              placement="top"
              title={
                "Make sure the commercials are updated correctly before saving"
              }
              onConfirm={() => this.save()}
              okText="Save"
              cancelText="Cancel"
            >
              <button type="button" className="btn btn-success btn-block mt-3">
                Save
              </button>{" "}
            </Popconfirm>

            <br />

            <div className="card">
              <div className="card-body">
                <div class="custom-file">
                  <input
                    onChange={e => this.selectImage(e.target.files[0])}
                    type="file"
                    class="custom-file-input"
                  />
                  <label class="custom-file-label" for="customFile">
                    {this.state.image}
                  </label>
                </div>
                <small>
                  Having trouble uploading the image,{" "}
                  <ExplainModal title="Click Here" />
                </small>

                <Popconfirm
                  placement="top"
                  title={
                    <div>
                      Make sure the image aligns with the instructions
                      <br />
                      requirements.
                      <br />
                      You can find the instructions above this button
                    </div>
                  }
                  onConfirm={() => this.uploadImage()}
                  okText="Upload"
                  cancelText="Cancel"
                >
                  <button
                    type="button"
                    className="btn btn-outline-success btn-block mt-2 mb-0"
                  >
                    Upload Image
                  </button>{" "}
                </Popconfirm>

                <small>
                  Last updated :{" "}
                  {this.state.updated
                    ? this.state.updated.substring(0, 10)
                    : ""}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    commercials: state.All_commercials,
    movies: state.All_Movies
  };
};

export default connect(
  mapStateToProps,
  null
)(Commercials);
