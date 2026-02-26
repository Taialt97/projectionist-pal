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
    data: []
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

    let new_data = [...this.state.data];
    let arr = [];
    let i = 0;
    for (let item of new_data) {
      item.position = i;
      arr.push(item);
      i++;
    }
    this.setState({ data: arr });

    const url = "/commercial/update";
    const self = this;
    const username = localStorage.getItem("username");

    axios({
      method: "post",
      url: url,
      data: { data: arr, username: username }
    });
  };

  //-----------------------------------------------
  //-----------------------------------------------
  //
  // ! THIS IS WHERE THE COMPONENT STARTS FOR YOU.
  //
  //-----------------------------------------------
  //-----------------------------------------------

  componentDidMount() {
    console.log(this.state.data);
    const self = this;
    const username = localStorage.getItem("username");
    const url = "/commercial/all";
    axios({
      method: "get",
      url: url,
      params: { username: username }
    }).then(function(response) {
      let arr = [];
      for (let item of response.data) {
        console.log(response.data);
        if (item.table_name === self.props.name) {
          arr.push(item);
        }
      }
      self.setState({ data: arr });
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
      dataIndex: "remove",
      render: (remove, index) => (
        <Tag color="red" onClick={() => this.remove(index)}>
          {" "}
          Remove{" "}
        </Tag>
      )
    }
  ];

  newMethod() {
    return this;
  }

  remove = e => {
    const self = this;

    console.log(e);
    const url = "/commercial/remove";
    const username = localStorage.getItem("username");

    axios({
      method: "post",
      url: url,
      data: { data: e, username: username }
    }).then(function(result) {
      console.log(result.data);
      console.log(self.props.name);

      let arr = [];

      for (let item of result.data) {
        if (item.table_name === self.props.name) {
          arr.push(item);
        }
      }
      self.setState({ data: arr });
    });
  };

  commercial;
  getValue = e => {
    console.log(e.target.name);
    console.log(e.target.value);
    this.commercial = e.target.value;
    return;
  };

  submitValue = () => {
    const commercial = this.commercial;
    const username = localStorage.getItem("username");
    const url = "/commercial/add";
    const self = this;
    let position = this.state.data.length;

    axios({
      method: "post",
      url: url,
      data: {
        table: this.props.name,
        commercial: commercial,
        username: username,
        position: position
      }
    }).then(function(response) {
      console.log(response.data);
      console.log(self.props.name);

      let arr = [];

      for (let item of response.data) {
        if (item.table_name === self.props.name) {
          arr.push(item);
        }
      }
      self.setState({ data: arr });
    });
  };

  render() {
    console.log(this.state.data);

    const { table_label, size } = this.props;

    return (
      <div className="mb-3">
        <div className="card">
          <div className="card-body">
            <form>
              {/* Title of form */}
              <h4 className="d-inline"> {table_label} </h4>
              <p>Add and edit commercials</p>

              <div className="form-row ">
                {/* Starting At */}
                <div className="form-group col-8 mb-0">
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
            <div className="mx-3" />
            <div className="mt-2" />
            <Table
              size={size}
              columns={this.columns}
              dataSource={this.state.data}
              pagination={false}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow
              })}
            />
          </div>
        </div>
      </div>
    );
  }
}

const DragTable = DragDropContext(HTML5Backend)(DragSortingTable);
export default DragTable;
