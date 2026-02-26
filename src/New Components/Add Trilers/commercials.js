import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table, Tag, Modal, message } from "antd";
import "./index.css";
import Select from "../Form/Inputs/select";
import { connect } from "react-redux";
import axios from "axios";
import DragTable from "./commercials_table";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
let dragingIndex = -1;

export default class Commercials extends Component {


  // remove = e => {
  //   const self = this;

  //   console.log(e);
  //   const url = "/commercial/remove";
  //   const username = localStorage.getItem("username");

  //   axios({
  //     method: "post",
  //     url: url,
  //     data: { data: e, username: username }
  //   }).then(function(response) {
  //     for (let item of response.data) {
  //       switch (item.table_name) {
  //         case "morning":
  //           let morning = [];
  //           morning.push(item);
  //           self.setState({ morning: morning });
  //           break;

  //         case "noon":
  //           let noon = [];
  //           noon.push(item);
  //           self.setState({ morning: noon });
  //           break;

  //         case "night":
  //           let night = [];
  //           night.push(item);
  //           self.setState({ morning: night });
  //           break;

  //         default:
  //           break;
  //       }
  //     }
  //   });
  // };

  render() {
    return (
      <div>
        
        <DragTable
          name="morning"
          table_label="Morning Commercials"
          size="small"
          remove={e => this.remove(e)}
        />

        <DragTable
          name="noon"
          table_label="After Noon Commercials"
          size="small"
          remove={e => this.remove(e)}
        />

        <DragTable
          name="night"
          table_label="Night Commercials"
          size="small"
          remove={e => this.remove(e)}
        />
      </div>
    );
  }
}
