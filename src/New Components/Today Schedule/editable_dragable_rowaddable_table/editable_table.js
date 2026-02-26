import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table, Tag, Modal, message } from "antd";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import "./index.css";
import Select from "../../Form/Inputs/select";
import TimePickerInput from "../../Form/Inputs/time";
import { connect } from "react-redux";
import axios from "axios";
import updater from "../../../Function/updater";
import username from "../../../Function/username";
import { Link } from "react-router-dom";

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
    date: "",
    visible: false
  };

  componentDidMount() {
    const date = new Date();
    const date_date = String(
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
    this.setState({ date: date_date });
  }

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

  columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: poster => <img src={poster} alt="" height="50" />
    },
    {
      title: "Movie Title",
      dataIndex: "title"
    },
    {
      title: "Theater Number",
      dataIndex: "theater",
      render: theater => <p> Theater {theater} </p>
    },
    {
      title: "Stars At",
      dataIndex: "starts"
    },
    // {
    //   title: "Brake At",
    //   dataIndex: "brake"
    // },
    // {
    //   title: "Ends At",
    //   dataIndex: "end"
    // },
    {
      title: "Remove",
      dataIndex: "key",
      render: key => (
        <Tag onClick={() => this.removeRow(key)} color="red">
          REMOVE
        </Tag>
      )
    }
  ];

  // ! Theaters options creator
  theatersOptionsCreator = () => {
    let arr = [];
    const theaters = Number(localStorage.getItem("theaters"));
    console.log(theaters);
    let i;
    for (i = 0; i < theaters; i++) {
      arr.push({ value: i + 1, label: `Theater ${i + 1}` });
    }
    return arr;
  };

  // ! Movies options creator
  MoviesOptionsCreator = () => {
    let arr = [];
    const movies = this.props.movies;
    console.log(movies);
    for (let movie of movies) {
      console.log(movie);
      arr.push({
        value: movie,
        label: movie.title
      });
    }
    return arr;
  };

  // ! Get data from form
  temp_form_data = [];
  GetFormData = (e, name) => {
    console.log(e);
    this.temp_form_data[name] = e;
    console.log(this.temp_form_data);
  };

  // ! Create the form data
  temp_table_data = {};
  i = 0;
  AddDataToList = () => {
    const self = this;
    // movie theater time
    const c = this.temp_form_data;
    if (!c.theater) {
      message.warning("Please select theater");
      return;
    } else if (!c.movie) {
      message.warning("Please select movie");
      return;
    } else if (!c.time) {
      message.warning("Please insert time");
      return;
    }
    console.log(this.temp_form_data);
    let table_data = this.temp_table_data;
    let form_data = this.temp_form_data;

    let poster = this.props.posters.find(function(element) {
      return element.title === form_data.movie.label;
    });

    const starting_time = form_data.time;
    let sh = starting_time.slice(0, 2);
    let sm = starting_time.slice(3, 5);
    let ss = starting_time.slice(6, 8);

    const brake = form_data.movie.value.intermission;
    let bh = Number(sh) + Number(brake.slice(0, 2)); // 01
    let bm = Number(sm) + Number(brake.slice(3, 5)); // 00
    let bs = Number(ss) + Number(brake.slice(6, 8)); // 00
    // if hours is more then 24, make it 00 and
    if (bh >= 24) {
      bh = bh - 24;
    }
    if (bm >= 60) {
      bh = bh + 1;
      bm = bm - 60;
    } else if (bm === 120) {
      bh = bh + 2;
      bm = 0;
    } else if (bs >= 60) {
      bm = bh + 1;
      bs = bm - 60;
    } else if (bs === 120) {
      bm = bh + 2;
      bs = 0;
    }

    console.log(bs.toString().length);

    if (bh.toString().length === 1) {
      bh = "0" + bh;
    }
    if (bm.toString().length === 1) {
      bm = "0" + bm;
    }
    if (bs.toString().length === 1) {
      bs = "0" + bs;
    }

    let brake_time = bh + ":" + bm + ":" + bs;

    const ending = form_data.movie.value.light_on;
    let eh = Number(starting_time.slice(0, 2)) + Number(ending.slice(0, 2));
    let em = Number(starting_time.slice(3, 5)) + Number(ending.slice(3, 5));
    let es = Number(starting_time.slice(6, 8)) + Number(ending.slice(6, 8));
    if (eh >= 24) {
      eh = eh - 24;
    }
    if (em >= 60) {
      eh = eh + 1;
      em = em - 60;
    } else if (em === 120) {
      eh = eh + 2;
      em = 0;
    }
    if (es >= 60) {
      em = eh + 1;
      es = em - 60;
    } else if (es === 120) {
      em = eh + 2;
      es = 0;
    }

    if (eh.toString().length === 1) {
      eh = "0" + eh;
    }
    if (em.toString().length === 1) {
      em = "0" + em;
    }
    if (es.toString().length === 1) {
      es = "0" + es;
    }

    let end_time = eh + ":" + em + ":" + es;

    // all objects
    console.log(this.i);
    table_data.username = username();
    table_data.date = this.state.date;
    table_data.key = this.i;
    table_data.poster = `/public/uploads/${poster.poster}`;
    table_data.title = form_data.movie.label;
    table_data.theater = form_data.theater.value;
    table_data.starts = form_data.time;
    table_data.brake = brake_time;
    table_data.end = end_time;

    let data = [...this.state.data];
    console.log("copy of state data", data);

    for (let item of data) {
      if (
        item.title === form_data.movie.label &&
        item.starts === form_data.time &&
        item.theater === form_data.theater.value
      ) {
        message.warning("item already exists");
        return;
      } else if (
        item.theater === form_data.theater.value &&
        item.starts === form_data.time
      ) {
        message.warning("item already exists or theater in use");
        return;
      }
      continue;
    }

    data.push(this.temp_table_data);
    this.setState({ data: data });
    this.temp_table_data = {};
    this.i++;
  };

  // ! Remove row
  removeRow = key => {
    console.log(this.state.data);
    let data = [...this.state.data];

    let filtered = data.filter(function(value, index, arr) {
      return value.key !== key;
    });

    console.log(filtered);
    this.setState({ data: filtered });
  };

  // --------------------
  // ! Modal Content
  // --------------------
  modal_columns = [
    {
      title: "Movie Title",
      dataIndex: "title"
    },
    {
      title: "Theater Number",
      dataIndex: "theater"
    },
    {
      title: "Stars At",
      dataIndex: "starts"
    },
    {
      title: "Brake At",
      dataIndex: "brake"
    },
    {
      title: "Ends At",
      dataIndex: "end"
    }
  ];

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
    this.submit();
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  // --------------------
  // ! Axios
  // --------------------
  submit = () => {
    let d = new Date();
    let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log(this.state.data);
    const data = [...this.state.data];
    const url = "/schedule/add";
    const self = this;
    // calls a function that add an update
    // import updater from "../../Updater Function/updater"
    updater(2, "Updated the schedule");

    axios({
      method: "post",
      url: url,
      data: {
        data: data
      }
      // data: [...this.state.data]
    });
    message.success("Schedule updated successfully");
    localStorage.setItem("progress", "");
    localStorage.setItem("updated", JSON.stringify([]));
  };

  newMethod() {
    return this;
  }

  render() {
    console.log(this.state.data);

    return (
      <div className="mt-3">
        <div className="card">
          <div className="card-body">
            <form onSubmit={e => this.GetFormData(e)}>
              {/* Title of form */}
              <h5 className="mb-0">Fill Schedule</h5>
              <p>Add movies according to today's schedule</p>
              <h6>Date : {this.state.date} </h6>

              <div className="form-row ">
                {/* Theater */}
                <div className="form-group col-2 mb-0">
                  <Select
                    label="Theater Number"
                    options={this.theatersOptionsCreator()}
                    fulldata={e => this.GetFormData(e, "theater")}
                  />
                </div>

                {/* Title */}
                <div className="form-group col-2 mb-0">
                  <Select
                    label="Movie Title"
                    options={this.MoviesOptionsCreator()}
                    fulldata={e => this.GetFormData(e, "movie")}
                  />
                </div>

                {/* Starting At */}
                <div className="form-group col-md-2 mb-0">
                  <TimePickerInput
                    className="form-control"
                    label="Starting At"
                    name="starting"
                    data={e => this.GetFormData(e, "time")}
                  />
                </div>

                {/* Add To List */}
                <div className="form-group col-md-2 mb-0">
                  <label> Add To List </label>
                  <button
                    onClick={() => this.AddDataToList()}
                    type="button"
                    className="btn btn-outline-info btn-block "
                  >
                    Add To List
                  </button>
                </div>

                {/* Submit List */}
                <div className="form-group col-md-4 mb-0">
                  <label> Submit Schedule </label>
                  <button
                    onClick={this.showModal}
                    type="button"
                    className="btn btn-info btn-block "
                  >
                    Submit List
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <br />
        <Table
          size="middle"
          columns={this.columns}
          dataSource={this.state.data}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow
          })}
        />
        <div>
          <Modal
            title="Submit Table"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <h4 className="mb-0"> Attention </h4>
            <p>Please make sure the table is correct before submitting </p>
            <Table
              size="small"
              pagination={false}
              columns={this.modal_columns}
              dataSource={this.state.data}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow
              })}
            />
          </Modal>
        </div>
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
