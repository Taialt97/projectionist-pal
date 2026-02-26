import React from "react";

export default function dateTime(params) {
  switch (params) {
    case "date":
      const d = new Date();
      const date = String(
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
      );
      return { date: date };

    case "time":
      let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      return { time: time };

    case "date_time":
      return { time: time, date: date };

    default:
      break;
  }
}
