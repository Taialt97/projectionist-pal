import React, { Component } from "react";
import Select from "../Form/Inputs/select";
import axios from "axios";
import TimePickerInput from "../Form/Inputs/time";
import Jumbotron from "../Jumbotron/jumbotron";
import DragTable from "./editable_dragable_rowaddable_table/editable_table";
import { Alert, Modal } from "antd";
import Header from "../Page Header/header";
import updater from "../../Function/updater"
import username from "../../Function/username";

export default class schedule extends Component {
  state = {
    schedule: false
  };

  componentDidMount() {
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
    }).then(function(result) {
      if (result.data.length > 1) {
        self.setState({ schedule: true });
      }
    });
  }

  confirm = Modal.confirm;
  showConfirm = () => {
    const self = this;

    this.confirm({
      title: "WARNING",
      content:
        "Deleting the current schedule and creating a new one will clear all daily updates.",
      onOk() {

    
        // calls a function that add an update
        updater(2,"Removed the schedule")

    

        const date = new Date();
        const date_date = String(
          date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
        const url = "/schedule/remove";
        axios({
          method: "get",
          url: url,
          params: {
            date: date_date,
            username: username()
          }
        }).then(function(result) {
          self.setState({ schedule: false });
          localStorage.removeItem("progress");
          localStorage.removeItem("updated");
        });
      },
      onCancel() {}
    });
  };

  render() {
    if (this.state.schedule === true) {
      return (
        <div>
          <Header
            title="Create Schedule"
            content={
              <div>
                <h5>
                  Here you can create new schedule for today. <br />
                  Make sure that the schedule is identical to the printed one.{" "}
                  <br />
                  Take your time.
                </h5>
              </div>
            }
            color="#FFC107"
          />
          <Alert
            className="mt-3"
            message="WARNING"
            description={
              <div>
                Schedule was already updated and uploaded to website. <br />
                Deleting the current schedule and creating a new one will clear
                all daily updates. <br />
              </div>
            }
            type="warning"
            showIcon
          />{" "}
          <button
            onClick={this.showConfirm}
            type="button"
            className="btn btn-outline-info btn-block mt-3"
          >
            Create New Schedule
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* import Header from "../Page Header/header"; */}
        <Header
          title="Create Schedule"
          content={
            <div>
              <h5>
                Here you can create new schedule for today. <br />
                Make sure that the schedule is identical to the printed one.{" "}
                <br />
                Take your time.
              </h5>
            </div>
          }
          color="#FFC107"
        />

        <DragTable />
      </div>
    );
  }
}
