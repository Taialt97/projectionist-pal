import axios from "axios";
import username from "./username";

// Send an update to the database 

// type 1 = daily movie updates (the regular)
// type 2 = schedule related
// type 3 = Key related
// type 3 = Light related
// type 4 = Theater related
// type 5 = Movie info related

// title = Message
// Notes = Extra content 

export default function updater(type,title,notes)  {
  let d = new Date();
  let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

  axios({
    method: "get",
    url: "/unreg-update",
    params: {
      type: type,
      date: date,
      time: time,
      username: username(),
      title: title,
      notes: (notes) ? notes : "" 
    }
  });
};

// // calls a function that add an update
// update("Updated the schedule")

