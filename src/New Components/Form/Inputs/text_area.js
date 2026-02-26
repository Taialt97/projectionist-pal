import React from "react";

export default class TextArea extends React.Component {
  change = e => {
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
    const { label, name, rows, placeholder, small } = this.props;

    return (
      <div className={this.class()}>
        <label> {label} </label>
        <textarea
          class="form-control"
          name={name}
          rows={rows}
          placeholder={placeholder}
          onChange={e => this.change(e)}
        />
        <small className="form-text text-muted">{small}</small>
      </div>
    );
  }
}
