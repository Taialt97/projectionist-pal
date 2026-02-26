import React from "react";

export default class Text extends React.Component {

  value = this.props.value

  change = e => {
    this.value = e.target.value
    this.props.data(e.target.value, e.target.name);
  };

  class = () => {
    if (this.props.class) {
      return this.props.class;
    } else {
      return "form-group";
    }
  };

  render() {
    const { label, name, type, placeholder, small, color, labelColor, disabled } = this.props;

    return (
      <div className={this.class()}>
        <label style = {{ color:`${labelColor}` }}> {label} </label>
        <input 
          disabled =  {(disabled === true) ? "disabled" : ""}
          style = {{ borderColor:`${color}` }}
          value = {this.value}
          name={name}
          type={type}
          className= {"form-control" }
          placeholder={placeholder}
          onChange={e => this.change(e)}
        />
        <small className="form-text text-muted">{small}</small>
      </div>
    );
  }
}
