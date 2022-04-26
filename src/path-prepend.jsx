import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { BACKEND_PATH } from "./ENVIRONMENT";

function Link(props) {
  const { to } = props;
  return <RouterLink {...props} to={`${BACKEND_PATH}${to}`} />; // eslint-disable-line react/jsx-props-no-spreading
}

export default Link;
