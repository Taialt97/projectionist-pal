import React, { Component } from "react";
import { Tabs } from "antd";
import Trailers from "./trailers";
import Commercials from "./commerchials";
import Header from "../Page Header/header";

export default class TrailersCommercials extends Component {
  render() {
    const TabPane = Tabs.TabPane;

    function callback(key) {
      console.log(key);
    }
    return (
      <div>
        <Header
          title="Trailers And Commercials"
          content={
            <div>
              <h5>
                Here you can add new trailers to full trailer list and edit a
                specific movie tailer table <br />
                If the trailer exists in the table you will be notified.
              </h5>
            </div>
          }
          color="#8BC34A"
        />
        <div className="mb-3" />
        <Tabs onChange={callback} type="card">
          <TabPane tab="Trailers" key="1">
            <Trailers />
          </TabPane>
          <TabPane tab="Commercials" key="2">
            <Commercials />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
