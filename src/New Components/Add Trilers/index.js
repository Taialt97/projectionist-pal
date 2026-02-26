import React, { Component } from "react";
import { Tabs } from "antd";
import AddTrailer from "../Add Trilers/add_trailers";
import Trailers from "./trailers";
import Jumbotron from "../Jumbotron/jumbotron";
import Header from "../Page Header/header";
import Commercials from "./commercials"

export default class Index extends Component {
  callback = key => {
    console.log(key);
  };
  render() {
    const TabPane = Tabs.TabPane;

    return (
      <div>
        {/* import Header from "../Page Header/header"; */}
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

        <Tabs className="mt-3" onChange={this.callback} type="card">
          <TabPane tab="All Trailers" key="1">
            <AddTrailer />
          </TabPane>
          <TabPane tab="Trailers In Movies" key="2">
            <Trailers />
          </TabPane>
          <TabPane tab="Commercials" key="3">
            <Commercials />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
