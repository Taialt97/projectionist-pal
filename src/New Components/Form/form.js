/* eslint-disable default-case */
/*jshint loopfunc: true */

import React, { Component } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Text from "./Inputs/text";
import TextArea from "./Inputs/text_area";
import SelectInput from "./Inputs/select";
import File from "./Inputs/file";
import DatePickerInput from "./Inputs/date";
import TimePickerInput from "./Inputs/time";
import { Checkbox, message } from "antd";

export default class Formjs extends Component {
  state = {};

  submitForm = e => {
    e.preventDefault();

    // ONLY FOR THIS PROJECT
    if (this.state.poster) {
      let poster_url = "/movies/add/poster";
      let poster = new FormData();
      poster.append("selectedFile", this.state.poster);
      poster.append("movieTitle", this.state.title);
      axios({
        method: "post",
        url: poster_url,
        data: poster
      }).then(function(response) {
        console.log(response);
      });
    } 

    console.log(this.state);
    axios({
      method: this.props.method,
      url: this.props.url,
      data: this.state,
      params: this.state
    })
      .then(response => {
        console.log(response);
        this.setState({ axios_res: response });
        message.success("Movie submmited successesfully")
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  // CHECKS IF IS FORM ROW AND PUSH INPUTS TO ARRAY
  createForm = () => {
    let expandCreateForm = this.expandCreateForm;
    let form = [];
    const prop_form = this.props.form; // CHANGE TO PROPS.FORM

    for (let input of prop_form) {
      switch (input.type) {
        case "form-row": // IF FORM ROW PUSH TO ARRAY THEN PUSH THE ARRAY TO FORM
          let subInputs = [];
          for (let sub_inputs of input.fields) {
            let createinput = expandCreateForm(sub_inputs);
            subInputs.push(createinput);
          }
          form.push(<div className="form-row"> {subInputs} </div>);
          break;
        default:
          let createinput = expandCreateForm(input);
          form.push(createinput);
      }
    }

    return form;
  };

  // TYPE CHEACK, GO OVER ALL TYPES
  expandCreateForm = input => {
    let temp_input = [];

    switch (input.type) {
      //TEXT
      case "text":
        temp_input.push(
          <Text
            disabled={input.disabled}
            labelColor={input.labelColor}
            color={input.color}
            value={input.val}
            class={input.col}
            label={input.label}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            small={input.small}
            data={(value, name) => this.getData(value, name)}
          />
        );
        break;

      // SELECT
      case "select":
        temp_input.push(
          <SelectInput
            options={input.options}
            class={input.col}
            label={input.label}
            small={input.small}
            data={(value, name) => this.getData(value, name)}
            name={input.name}
            multi={input.multi}
          />
        );
        break;

      // TEXTAREA
      case "textarea":
        temp_input.push(
          <TextArea
            class={input.col}
            label={input.label}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            small={input.small}
            data={(value, name) => this.getData(value, name)}
          />
        );
        break;
      // FILE
      case "file":
        temp_input.push(
          <File
            class={input.col}
            label={input.label}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            small={input.small}
            data={(value, name) => this.getData(value, name)}
          />
        );
        break;
      // DATE
      case "date":
        temp_input.push(
          <DatePickerInput
            class={input.col}
            label={input.label}
            name={input.name}
            selected={this.state.startDate}
            data={(value, name) => this.getData(value, name)}
          />
        );
        break;
      // DATE
      case "time":
        temp_input.push(
          <TimePickerInput
            placeholder = {input.placeholder}
            class={input.col}
            label={input.label}
            name={input.name}
            selected={this.state.startDate}
            data={(value, name) => this.getData(value, name)}
          />
        );
        break;
      // CHECKBOX
      case "checkbox":
        temp_input.push(
          <Checkbox
            name={input.name}
            onChange={(value, name) => this.getChecked(value, name)}
          >
            {input.label}
          </Checkbox>
        );
        break;

      default:
        temp_input.push(
          <Text
            disabled={input.disabled}
            labelColor={input.labelColor}
            color={input.color}
            value={input.val}
            class={input.col}
            label={input.label}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            small={input.small}
            data={(value, name) => this.getData(value, name)}
          />
        );
        break;
    }

    return temp_input;
  };

  // GET DATA FROM INPUT, SET IN STATE
  getData = (value, name) => {
    this.setState({ [name]: value });
    console.log(name, value);

  };

  getChecked = (value, name) => {
    this.setState({ [value.target.name]: value.target.checked });
    console.log( value.target.name, value.target.checked);
  };

  render() {
    if (this.props.data) {
      this.props.data(this.state);
    }
    return (
      <form onSubmit={e => this.submitForm(e)} className="form">
        {this.createForm()}
        <button type="submit" class={this.props.btnclass}>
          {this.props.submit}
        </button>
        <small> {this.props.small} </small>
      </form>
    );
  }
}
