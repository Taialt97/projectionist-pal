import React, { Component } from "react";
import CreateUpdateInfoForm from "./form";
import CreateUpdateInfoCard from "./card";
import Jumbotron from "../Jumbotron/jumbotron";
import Header from "../Page Header/header";

export default class CreateUpdateInfo extends Component {

  render() {
    return (
      <div>
        {/* import Header from "../Page Header/header"; */}
        <Header
          title="Create New Movie"
          content={
            <div>
              <h5>
                Here you can create a new movie card on movie arrival. <br/>
                Make sure all the information is correct before you submit the movie, <br/>
                For the poster, just search the movie poster on google, make sure its not too small.
              </h5>
            </div>
          }
          color="#607D8B"
        />
        <div className="row mt-3">
          <div className="col-8">
            <CreateUpdateInfoForm />
          </div>
          <div className="col-4 pl-0">
            <CreateUpdateInfoCard />
          </div>
        </div>
      </div>
    );
  }
}
