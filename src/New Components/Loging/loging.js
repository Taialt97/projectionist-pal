import React, { Component } from "react";
import { Timeline, List, Typography } from "antd";
import Logger from "./logger";
import username from "../../Function/username";

export default class Loging extends Component {
  // ! State
  state = {
    notifications: [], // work with redux
    log: []
  };

  render() {
    return (
      <div>
        <div className="card">
          <div className="card-header">Daily Log</div>
          <div className="card-body">
            <h5 className="card-title">Notifications</h5>
            <List
              size="small"
              bordered
              dataSource={this.state.notifications}
              renderItem={item => (
                <List.Item>
                  <Typography.Text mark>[NOTE]</Typography.Text> {item}
                </List.Item>
              )}
            />
            <br />
            <h5 className="card-title mb-0">
              {username()}, {this.new_date}
            </h5>
            <p className="card-text">
              Will log your interaction with the website for management
              supervision
            </p>

            <div
              className="card"
              style={{
                overflow: "scroll",
                overflowX: "hidden"
              }}
            >
              <div className="card-body">
                {/* {this.log()} */}
                <Timeline>
                  <Timeline.Item color="green">Have a good day</Timeline.Item>
                </Timeline>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
