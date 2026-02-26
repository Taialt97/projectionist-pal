import React, { Component } from "react";
import { Modal, Button } from "antd";

export default class ExplainModal extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <span>
        <p
          style={{ cursor: "pointer", color: "blue", display: "inline" }}
          onClick={this.showModal}
        >
          {this.props.title}
        </p>
        <Modal
          title="How To Upload The Image In 5 Steps"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Gotcha
            </Button>,
          ]}
        >
          <h5>So this is what you do:</h5>
          <p>
            1. Click search on the desktop toolbar and search for "Snipping
            Tool"
          </p>
          <img src="/SnippingTool.png" alt="Snipping Tool" width="30%" /> <br />
          <small>This is how it looks</small>
          <p className="mt-2">
            2. After clicking on the Snipping Tool icon a window will popup.
            inside the window Click on "New"
          </p>
          <img src="/SnippingTool2.png" alt="Snipping Tool" width="80%" /> <br />
          <p className="mt-2">
            3. Now select the area of the table you want to upload (the trailers
            or the commercials), try capture the table as close as possible.
          </p>
          <img src="/SnippingTool3.png" alt="Snipping Tool" width="100%" /> <br />
          <small>This is how it should looks</small>
          <p className="mt-2">
            4. Save the image with the current date like so:
          </p>
          <img src="/SnippingTool4.png" alt="Snipping Tool" width="100%" /> <br />
          <p className="mt-2">
            5. Save the picture and upload
          </p> 
        </Modal>
      </span>
    );
  }
}
