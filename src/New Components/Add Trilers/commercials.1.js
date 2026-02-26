import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table, Tag, Modal, message } from "antd";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import "./index.css";
import Select from "../Form/Inputs/select";
import TimePickerInput from "../Form/Inputs/time";
import { connect } from "react-redux";
import axios from "axios";
let dragingIndex = -1;

class BodyRow extends Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: "move" };

    let className = restProps.className;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += " drop-over-downward";
      }
      if (restProps.index < dragingIndex) {
        className += " drop-over-upward";
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

const DragableBodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource("row", rowSource, connect => ({
    connectDragSource: connect.dragSource()
  }))(BodyRow)
);

class DragSortingTable extends Component {
  state = {
    data: [],
    morning: [],
    noon: [],
    night: []
  };

  components = {
    body: {
      row: DragableBodyRow
    }
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
        }
      })
    );
  };

  //-----------------------------------------------
  //-----------------------------------------------
  //
  // ! THIS IS WHERE THE COMPONENT STARTS FOR YOU.
  //
  //-----------------------------------------------
  //-----------------------------------------------

  componentDidMount() {
    const self = this;
    const username = localStorage.getItem("username");
    const url = "/commercial/all";
    axios({
      method: "get",
      url: url,
      params: { username: username }
    }).then(function(response) {
      console.log(response.data);

      // date: "2019-05-12T17:47:03.000Z";
      // id: 1;
      // table_name: "undefined";
      // title: "Poop";
      // username: "Karmiel";

      for (let item of response.data) {
        switch (item.table_name) {
          case "morning":
            let morning = [...self.state.morning];
            morning.push(item);
            self.setState({ morning: morning });
            break;

          case "noon":
            let noon = [...self.state.noon];
            noon.push(item);
            self.setState({ noon: noon });
            break;

          case "night":
            let night = [...self.state.night];
            night.push(item);
            self.setState({ night: night });
            break;

          default:
            break;
        }
      }
    });
  }

  columns = [
    {
      title: "Commercial Title",
      dataIndex: "title"
    },
    {
      title: "Date Added",
      dataIndex: "date"
    },
    {
      title: "Remove Commercial",
      dataIndex: "remove"
    }
  ];

  getValue = e => {
    if (e.target) {
      console.log(e.target.name);
      console.log(e.target.value);
      this.setState({ commercial: e.target.value });
      return;
    } else {
      console.log(e);
      this.setState({ table: e });
    }
  };

  submitValue = () => {
    const table = this.state.table;
    const commercial = this.state.commercial;
    const username = localStorage.getItem("username");
    const url = "/commercial/add";
    const self = this;
    axios({
      method: "post",
      url: url,
      data: { table: table, commercial: commercial, username: username }
    }).then(function(response) {
      // date: "2019-05-12T17:47:03.000Z";
      // id: 1;
      // table_name: "undefined";
      // title: "Poop";
      // username: "Karmiel";
      let morning = [];
      let noon = [];
      let night = [];

      for (let item of response.data) {
        console.log(response.data);

        switch (item.table_name) {
          case "morning":
            morning.push(item);
            self.setState({ morning: morning });
            break;

          case "noon":
            noon.push(item);
            self.setState({ noon: noon });
            break;

          case "night":
            night.push(item);
            self.setState({ night: night });
            break;

          default:
            break;
        }
      }

      self.setState({ morning:morning, noon:noon, night:night })
    });
  };

  newMethod() {
    return this;
  }

  render() {
    console.log(this.state.data);

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <form>
              {/* Title of form */}
              <h5 className="mb-0">Add And Edit Commercials</h5>
              <p>Add and edit commercials</p>

              <div className="form-row ">
                {/* Theater */}
                <div className="form-group col-3 mb-0">
                  <Select
                    name="selected"
                    data={e => this.getValue(e)}
                    label="Commercial Time"
                    options={[
                      { label: "Morning Commercials", value: "morning" },
                      { label: "After Noon Commercials", value: "noon" },
                      { label: "Night Commercials ", value: "night" }
                    ]}
                  />
                </div>

                {/* Starting At */}
                <div className="form-group col-md-5 mb-0">
                  <label> Commercial Title </label>
                  <input
                    className="form-control"
                    name="commercial"
                    onChange={e => this.getValue(e)}
                  />
                </div>

                {/* Submit List */}
                <div className="form-group col-md-4 mb-0">
                  <label> Submit Schedule </label>
                  <button
                    onClick={() => this.submitValue()}
                    type="button"
                    className="btn btn-success btn-block "
                  >
                    Submit List
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-3" />
        <h4 className="d-inline"> Morning Commercials </h4>
        <div className="mt-2" />
        <Table
          size="small"
          columns={this.columns}
          dataSource={this.state.morning}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow
          })}
        />

        <div className="mt-3" />
        <h4 className="d-inline"> After Noon Commercials </h4>
        <div className="mt-2" />
        <Table
          size="small"
          columns={this.columns}
          dataSource={this.state.noon}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow
          })}
        />

        <div className="mt-3" />
        <h4 className="d-inline"> Night Commercials </h4>
        <div className="mt-2" />
        <Table
          size="small"
          columns={this.columns}
          dataSource={this.state.night}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow
          })}
        />
      </div>
    );
  }
}

const DragTable = DragDropContext(HTML5Backend)(DragSortingTable);

const mapStateToProps = state => {
  return {
    movies: state.All_Movies,
    posters: state.All_Posters
  };
};

export default connect(
  mapStateToProps,
  null
)(DragTable);
