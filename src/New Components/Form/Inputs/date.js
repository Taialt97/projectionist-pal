import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class DatePickerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    
    let dd = e.getDate()
    let mm = (e.getMonth()+1)
    let yy = e.getFullYear()
    let full_date = (yy +"-"+ mm +"-"+ dd)
   
    
    
    this.props.data(`${full_date}`, this.props.name);
    this.setState({ startDate: e });
    console.log(e);
  }

  class = () => {
    if (this.props.class) {
      return this.props.class;
    } else {
      return "form-group";
    }
  };


  render() {
    const { label, name, small, placeholder } = this.props;
    return (
      <div className={this.class()}>
        <label> {label} </label>
        <DatePicker
          dateFormat="yyy/MM/dd"
          className="form-control"
          style = {{ width:"100%" }}
          name={name}
          selected={this.state.startDate}
          onChange={e => this.handleChange(e)}
        />
        <small className="form-text text-muted">{small}</small>
      </div>
    );
  }
}

