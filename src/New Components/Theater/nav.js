import React, { Component } from "react";
import { Tabs } from "antd";
import { connect } from "react-redux"
import { NAV_THEATER_NUMBER } from "../../Redux/Actions/types";

const TabPane = Tabs.TabPane;

class NavT extends Component {

  callback = key => {
    this.props.theater_number(Number(key)+1);
  };

  tabPane = () => {
    let theaters = localStorage.getItem("theaters");
    let i;
    let tabs = [];
    for (i = 0; i < theaters; i++) {
      tabs.push(<TabPane tab={"Theaters " + (i + 1)} key={i} />);
    }
    return (
      <Tabs onChange={this.callback} type="card">
        {tabs}
      </Tabs>
    );
  };

  render() {
    return <div>{this.tabPane()}</div>;
  }
}

const Nav_Theater_Number = dispatch => {
  return {
    theater_number: value => {
      dispatch({
        type: NAV_THEATER_NUMBER,
        payload: value
      });
    }
  };
};

export default connect(
  null,
  Nav_Theater_Number
)(NavT);
