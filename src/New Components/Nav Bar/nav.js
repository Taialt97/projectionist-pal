import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Route, Link } from "react-router-dom";
import { Popconfirm, message, Button } from "antd";
// PAGES
import CreateUpdateInfo from "../Create Update Info/page";
import CreateSchedule from "../Today Schedule/schedule";
import Home from "../Home/home";
import Theater from "../Theater/theater";
import Profile from "../Profile/profile";
import Keys from "../Keys/kyes";
import UserHeader from "../Page Header/user_header";
import TrailersCommercials from "../Trailers and Commercials/index"
export default class MenuExampleHeader extends Component {
  state = {};

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/";
  };

  componentDidMount() {
    if (localStorage.getItem("ready")) {
      return;
    } else {
      localStorage.setItem("ready", "ready");
      window.location.reload();
    }
  }

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu
          className="small"
          style={{
            borderRadius: "0px",
            boxShadow: "none"
          }}
        >
          <Menu.Item
            as={Link}
            to="/movie-updates"
            name="Movie Updates"
            active={activeItem === "movie-updates"}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to="/make_schedule"
            name="Today's Schedule"
            active={activeItem === "makeSchedule"}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to="/trailers"
            name="Trailers & Commercials"
            active={activeItem === "Trailers"}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to="/create_movie"
            name="Create New Movie"
            active={activeItem === "createMovie"}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to="/tethers"
            name="Theater Setup And Updates"
            active={activeItem === "theater"}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to="/keys"
            name="Keys Management"
            active={activeItem === "keys"}
            onClick={this.handleItemClick}
          />

          <Menu.Menu position="right">
            <Menu.Item
              as={Link}
              to="/profile"
              name="Profile"
              active={activeItem === "profile"}
              onClick={this.handleItemClick}
            />

            <Popconfirm
              placement="leftBottom"
              title={"Sure you want to logout"}
              onConfirm={() => this.logout()}
              okText="Yes"
              cancelText="No"
            >
              <Menu.Item
                as={Link}
                to="/"
                name="Logout"
                active={activeItem === "/"}
                style={{
                  color: "gray"
                }}
              />
            </Popconfirm>
          </Menu.Menu>
        </Menu>

        <UserHeader />

        <Route path="/movie-updates" exact component={Home} />
        <Route path="/trailers" exact component={TrailersCommercials} />
        <Route path="/make_schedule" exact component={CreateSchedule} />
        <Route path="/create_movie" component={CreateUpdateInfo} />
        <Route path="/tethers" component={Theater} />
        <Route path="/profile" component={Profile} />
        <Route path="/keys" component={Keys} />

        <Route path="/" />
      </div>
    );
  }
}
