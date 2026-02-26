import React from "react";

export default function username() {
  let sessionStorage_username = sessionStorage.getItem("username");
  let localStorage_username = localStorage.getItem("username");

  if (sessionStorage_username) {
    return sessionStorage_username;
  } else if (localStorage_username) {
    return localStorage_username;
  } else {
    return false;
  }
}
