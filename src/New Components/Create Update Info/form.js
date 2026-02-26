import React, { Component } from "react";
import Formjs from "../Form/form";
import axios from "axios";
import { connect } from "react-redux";
import { CREATE_CARD } from "../../Redux/Actions/types";
import SelectInput from "../Form/Inputs/select";
import TimePickerInput from "../Form/Inputs/time";
import DatePickerInput from "../Form/Inputs/date";
import { message } from "antd";
import updater from "../../Function/updater";
import username from "../../Function/username";
import AMReducer from "../../Redux/Reducers/all_movies";
import APReducer from "../../Redux/Reducers/all_posters";
class CreateUpdateInfoForm extends Component {
  d = new Date();
  date =
    this.d.getFullYear() +
    "-" +
    (this.d.getMonth() + 1) +
    "-" +
    this.d.getDate();

  state = {
    form: {
      username: username(),
      rec_date: this.date
    },
    poster: []
  };

  form = {};
  poster = {};

  // ! Create Card
  createCard = () => {
    console.log(Object.keys(this.state.form).length);
    if (Object.keys(this.state.form).length >= 13 && this.state.poster) {
      let poster_url = "/movies/add/poster";
      const self = this;

      let poster = new FormData();
      poster.append("selectedFile", this.state.poster);
      poster.append("movieTitle", this.state.form.title);

      axios({
        method: "post",
        url: poster_url,
        data: poster
      }).then(function(result) {
        message.success("Poster submitted successfully");

        self.props.form([], {
          type: "ALL_POSTERS",
          all_posters: result.data
        });
      });

      console.log(this.state);
      axios({
        method: "post",
        url: "/movies/add",
        data: { form: this.state.form, username: username() }
      }).then(function(result) {
        message.success("Movie submitted successfully");
        console.log(result.data);
        self.props.form([], {
          type: "ALL_MOVIES",
          all_movies: result.data
        });
      });

      updater(
        6,
        "Created New Movie Card",
        `
      Movie Title: ${this.state.form.title},
      After Credit: ${this.state.form.after},
      Format: ${this.state.form.format},
      Intermission: ${this.state.form.intermission},
      Key Exp: ${this.state.form.key_exp},
      Key Exp Time: ${this.state.form.key_exp_time},
      Lang: ${this.state.form.lang},
      Lens: ${this.state.form.lens},
      Light On: ${this.state.form.light_on},
      Sub Title: ${this.state.form.sub_title}
      `
      );
    } else {
      message.warning("Please fill out all the input fields");
    }
  };

  // ! Poster data
  posterInput = e => {
    console.log(e.target.files[0]);
    const value = e.target.files[0];
    this.setState({ poster: value });
    this.form.poster = e.target.files[0];
    this.props.form(this.form);
  };

  // ! Select data
  selectInput = (e, name) => {
    console.log(e, name);
    let form = { ...this.state.form };

    form[name] = e;
    this.setState({ form: form });
    this.form[name] = e;
    this.props.form(this.form);
  };

  // ! Get Data of values
  // if title alrady in movies will not let them put another
  input = e => {
    if (e.target.name === "title") {
      for (let item of this.props.movies) {
        if (item.title === e.target.value) {
          let form = { ...this.state.form };
          form.title = "";
          this.setState({ form: form });
          this.form.title = null;
          this.props.form(this.form);
          message.warning("Movie already exists");
          return;
        } else {
          let form = { ...this.state.form };
          const name = e.target.name;
          const value = e.target.value;

          form[name] = value;
          this.setState({ form: form });
          this.form[name] = value;
          this.props.form(this.form);
        }
      }
    }
    let form = { ...this.state.form };
    const name = e.target.name;
    const value = e.target.value;

    form[name] = value;
    this.setState({ form: form });
    this.form[name] = value;
    this.props.form(this.form);
  };

  // OPTIONS
  lang = [
    { value: "English", label: "English" },
    { value: "Hebrew", label: "Hebrew" },
    { value: "Russian", label: "Russian" },
    { value: "Arabic", label: "Arabic" }
  ];

  lensType = [
    { value: "Flat", label: "Flat" },
    { value: "Scope", label: "Scope" }
  ];

  format = [
    { value: "2D", label: "2D" },
    { value: "3D", label: "3D" },
    { value: "4DX", label: "4DX" }
  ];

  bolean = [{ value: "Yes", label: "Yes" }, { value: "Nope", label: "Nope" }];

  theaters = () => {
    let theaters = [];
    // { value: "01", label: "Theater 01" },
    let ammount = localStorage.getItem("theaters");
    let i;
    for (i = 0; i < ammount; i++) {
      let _new = i + 1;

      theaters.push({ value: { _new }, label: `Theater ${_new}` });
    }
    return theaters;
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="mb-0">Create New Movie Card</h5>
          <p>Create a new card for a movie on movie arraival</p>

          <form id="form">
            {/* Movie Title */}
            <div class="form-group">
              <label>Movie Title</label>
              <input
                name="title"
                type="text"
                class="form-control"
                placeholder="Pulp Fiction, Blade Runner, Hellboy"
                value={this.state.form.title}
                onChange={e => this.input(e)}
              />
              {/* <small class="form-text text-muted">
                We'll never share your email with anyone else.
              </small> */}
            </div>

            <div class="form-group">
              <label>Poster</label>
              <div class="custom-file">
                <input
                  type="file"
                  class="custom-file-input"
                  id="customFile"
                  onChange={e => this.posterInput(e, "poster")}
                />
                <label class="custom-file-label" for="customFile">
                  Choose Poster Image
                </label>
              </div>
            </div>

            {/* Language, Sub Titles, Lens Type, Format */}
            <div className="row">
              <div className="col-3">
                <SelectInput
                  label="Language"
                  options={this.lang}
                  data={e => this.selectInput(e, "lang")}
                />
              </div>

              <div className="col-3 pl-0">
                <SelectInput
                  label="Sub Titles"
                  options={this.lang}
                  data={e => this.selectInput(e, "sub_title")}
                />
              </div>

              <div className="col-3 pl-0">
                <SelectInput
                  label="Lens Type"
                  options={this.lensType}
                  data={e => this.selectInput(e, "lens")}
                />
              </div>

              <div className="col-3 pl-0">
                <SelectInput
                  label="Format"
                  options={this.format}
                  data={e => this.selectInput(e, "format")}
                />
              </div>
            </div>

            {/* Key Expiration date, Key Expiration time */}
            <div className="row">
              <div className="col-6">
                <TimePickerInput
                  label="Key Expiration Time"
                  placeholder="00:00:00"
                  data={e => this.selectInput(e, "key_exp_time")}
                />
              </div>

              <div className="col-6 pl-0">
                <DatePickerInput
                  label="Key Expiration Date"
                  placeholder="00:00:00"
                  data={e => this.selectInput(e, "key_exp")}
                />
              </div>
            </div>

            {/* Storage , Receiving Date */}
            <div className="row">
              <div className="col-6">
                <SelectInput
                  label="Storage"
                  options={[
                    { value: 1, label: "In Storage" },
                    { value: 0, label: "Not In Storage" }
                  ]}
                  data={e => this.selectInput(e, "storage")}
                />
              </div>

              <div className="col-6 pl-0">
                <DatePickerInput
                  label="Receiving Date"
                  data={e => this.selectInput(e, "rec_date")}
                  small="The day you got the movie"
                />
              </div>
            </div>

            {/* Intermission, Lights On, After Credits */}
            <div className="row">
              <div className="col-4">
                <TimePickerInput
                  label="Intermission"
                  placeholder="00:00:00"
                  data={e => this.selectInput(e, "intermission")}
                />
              </div>

              <div className="col-4 p-0">
                <TimePickerInput
                  label="Lights On"
                  placeholder="00:00:00"
                  data={e => this.selectInput(e, "light_on")}
                />
              </div>

              <div class="form-group col-4">
                <label>After Credits</label>
                <input
                  name="after"
                  type="text"
                  class="form-control"
                  placeholder="00:00:00, 00:00:00"
                  onChange={e => this.input(e)}
                />
                <small class="form-text text-muted">
                  If no after credit input "none"
                </small>
              </div>
            </div>
          </form>

          <button
            type="button"
            class="btn btn-dark btn-block"
            onClick={() => this.createCard()}
          >
            Create Movie Card
          </button>
          <small class="form-text text-muted">
            Make sure you all the information is correct before submitting{" "}
          </small>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    trailers: state.All_Trailers,
    movies: state.All_Movies
  };
};

const Create_Card = dispatch => {
  return {
    form: (value, index) => {
      console.log(index);
      if (index === undefined) {
        dispatch({
          type: CREATE_CARD,
          payload: value
        });
      } else if (index.type === "ALL_MOVIES") {
        console.log(index.all_movies);
        dispatch({
          type: "ALL_MOVIES",
          all_movies: index.all_movies
        });
      } else if (index.type === "ALL_POSTERS") {
        dispatch({
          type: "ALL_POSTERS",
          all_posters: index.all_posters
        });
      }
    }
  };
};

export default connect(
  mapStateToProps,
  Create_Card
)(CreateUpdateInfoForm);
