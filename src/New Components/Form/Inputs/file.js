import React from "react";

export default class File extends React.Component {
  change = e => {
    this.props.data(e.target.files[0], e.target.name);
  };

  class = () => {
    if (this.props.class) {
      return this.props.class;
    } else {
      return "form-group";
    }
  };

  render() {
    const { label, name, placeholder, small } = this.props;

    return (
      <div className={this.class()}>
        <label> {label} </label>
        <div className="custom-file">
          <input
            name = {name}
            type="file"
            className="custom-file-input"
            onChange={e => this.change(e)}
          />
          <label className="custom-file-label"> {placeholder} </label>
        </div>
        <small className="form-text text-muted">{small}</small>
      </div>
    );
  }
}
