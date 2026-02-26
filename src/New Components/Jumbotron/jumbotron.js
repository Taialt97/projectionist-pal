import React, { Component } from 'react';

export default class Jumbotron extends Component {


render(){
   const { text, color, header, lead } = this.props

  return(
    <div className="jumbotron jumbotron-fluid mb-3" style={ color }>
    <div className="container" style={ text }>
    <h1 className="display-4 m-0" style={ text }>{ header }</h1>
    <p className="lead ml-1">{ lead }</p>
    </div>
    </div>
  )
}
}

