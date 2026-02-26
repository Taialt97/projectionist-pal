import React from "react";
import Select from "react-select";

let options = [];

export default class SelectInput extends React.Component {
  state = {
    selectedOption: null
  };

  handleChange = selectedOption => {
    if(this.props.fulldata){
      this.props.fulldata(selectedOption)
    }
    
    this.setState({ selectedOption });

    if ( this.props.multi ){
      this.props.data(JSON.stringify(selectedOption), this.props.name);
    }
    else if (this.props.data){
      this.props.data(selectedOption.value, this.props.name);
    }
  };

  class = () => {
    if (this.props.class) {
      return this.props.class;
    } else {
      return "form-group";
    }
  };

  render() {
    const { selectedOption } = this.state;
    options = this.props.options;
    const { label, small, multi } = this.props;

    return (
      <div className={this.class()}>
        <label htmlFor=""> {label} </label>
        <div>
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
            isMulti={multi}
          />
          <small className="form-text text-muted">{small}</small>
        </div>
      </div>
    );
  }
}
