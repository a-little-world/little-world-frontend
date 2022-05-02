import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { BACKEND_PATH } from "./ENVIRONMENT";
import { removeActiveTracks } from "./twilio-helper";

function Link(props) {
  const { to } = props;

  // kill video if linked out of call
  if (!["/call-setup", "/call"].includes(to)) {
    removeActiveTracks();
  }
  return <RouterLink {...props} to={`${BACKEND_PATH}${to}`} />; // eslint-disable-line react/jsx-props-no-spreading
}

export default Link;
