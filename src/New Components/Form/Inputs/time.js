import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class TimePickerInput extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     startDate: new Date()
  //   };
  //   this.handleChange = this.handleChange.bind(this);
  // }

  // handleChange(e) {

  //   let hh = ("0" + e.getHours() ).slice(-2)
  //   let mm = ("0" + e.getMinutes() ).slice(-2)
  //   let ss = ("0" + e.getSeconds() ).slice(-2)
  //   let full_time = (hh +":"+ mm +":"+ ss)

  //   this.props.data(`${full_time}`, this.props.name);
  //   this.setState({ startDate: e });
  //   console.log(e);
  // }

  state = {
    time: null
  };

  class = () => {
    if (this.props.class) {
      return this.props.class;
    } else {
      return "form-group";
    }
  };

  handleKeyPress = event => {
    if (event.key == "Backspace") {
      this.setState({ time: "" });
    }
  };

  timeEdit = e => {
    let input = e.target.value;

    // if(this.setState.time !== null){
    //   input = this.state.time
    // }

    let time = "";

    for (let item in input) {
      if (item === "2" && input.length < 5) {
        time += ":";
      } else if (item === "5" && input.length < 7) {
        time += ":";
      }

      time += input[item];
    }

    this.setState({ time: time });
    if (this.props.data) {
      this.props.data(time, this.props.name);
    }
  };

  render() {
    const { label, name, small, placeholder } = this.props;
    return (
      <div className={this.class()}>
        <label> {label} </label>
        <input
          type="text"
          name={name}
          value={this.state.time}
          onChange={e => this.timeEdit(e)}
          className="form-control"
          onKeyDown={this.handleKeyPress}
          placeholder={placeholder}
        />
        {/* <DatePicker
            selected={this.state.startDate}
            onChange={e => this.handleChange(e)}
            timeFormat="HH:mm:ss"
            showTimeSelect
            className="form-control"
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="HH:mm:ss"
            timeCaption="Time"
        /> */}
        <small className="form-text text-muted">{small}</small>
      </div>
    );
  }
}
