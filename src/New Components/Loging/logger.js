import React from 'react'
import { connect } from 'react-redux'


const Logger = (props) => {
    console.log(props.event);
    
    let logger = []

    if(localStorage.getItem("logger")){
      logger = JSON.parse(localStorage.getItem("logger"))
    }

    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let time = (h + ":" + m + ":" + s)

    logger.push(
      {
        time: time,
        event: props.event
      }
    )

    localStorage.setItem("logger", JSON.stringify(logger))
    props.logger(logger)

    return
}

const mapDispatchToProps = (dispatch) =>{
  return{
    logger: (value) => {
      dispatch({
        type: 'LOGGER',
        payload: value
      })
    }
  }
} 

export default connect(null, mapDispatchToProps)(Logger)
