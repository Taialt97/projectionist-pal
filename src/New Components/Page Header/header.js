import React, { Component } from "react";
import { PageHeader, Typography, Card } from "antd";

export default class Header extends Component {

  render() {
    return (
      <div>
        <Card
        style = {{borderTop : `10px solid ${this.props.color}`}}
        >
          <PageHeader title={this.props.title}>
            <div className="wrap">
              <div className="content">{this.props.content}</div>
            </div>
          </PageHeader>
        </Card>
      </div>
    );
  }
}
