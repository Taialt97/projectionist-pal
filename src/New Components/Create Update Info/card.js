import React, { Component } from "react";
import { connect } from "react-redux";

class CreateUpdateInfoCard extends Component {
    
  // I think it dose nothing
  //   trailers = () => {
  //     let trailers = this.props.items.form.trailers;
  //     let trailers_prev = [];

  //     if (trailers !== undefined) {
  //       let new_trailers = JSON.parse(trailers);
  //       new_trailers.forEach(function(trailer, index) {
  //         trailers_prev.push(
  //           <tr key={trailer.id}>
  //             <td> {index + 1} </td>
  //             <td> {trailer.label} </td>
  //           </tr>
  //         );
  //       });
  //     }
  //     return trailers_prev;
  //   };

  //   theaters = () => {
  //     let theaters = this.props.items.form.theaters;
  //     let theaters_prev = [];

  //     if (theaters !== undefined) {
  //       let new_theaters = JSON.parse(theaters);
  //       new_theaters.forEach(function(theater, index) {
  //         theaters_prev.push(<div> {theater.label} </div>);
  //       });
  //     }

  //     return theaters_prev;
  //   };

  //render
  render() {
    console.log(this.props.items.form);
    let info = this.props.items.form;
    let poster;
    if (info.poster) {
      poster = URL.createObjectURL(info.poster);
    }

    return (
      <div>
        <div
          className="card shadow-sm"
          style={{
            width: "100%"
            // boxShadow:' 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
          }}
        >
          <img src={poster} className="card-img-top" alt="..." />
          <div className="card-body">
            <h4 className="card-title m-0">{info.title}</h4>
            <small>
              <span> {info.lang} </span>|<span> {info.sub_title} </span>|
              <span> {info.lens} </span>|<span> {info.format} </span>
            </small>
            <p className="card-text m-0 mt-3">
              <b>Key Ends </b>:{" "}
              <span>
                {info.key_exp}, {info.key_exp_time}
              </span>
            </p>
            <p className="card-text m-0">
              <b>Day Received</b> : <span>{info.rec_date}</span>
            </p>

            <p className="card-text m-0">
              <b>Intermittion </b>: <span>{info.intermission}</span>
            </p>
            <p className="card-text m-0">
              <b>Lights On </b>: <span>{info.light_on}</span>
            </p>
            <p className="card-text m-0 mb-3">
              <b>After Credits </b>: <span>{info.after}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { items: state.Create_Card_Form };
};

export default connect(
  mapStateToProps,
  null
)(CreateUpdateInfoCard);
