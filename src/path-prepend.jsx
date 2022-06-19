import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { BACKEND_PATH } from "./ENVIRONMENT";

function Link(props) {
  const { to, className } = props;
  const newClasses = to ? className : `${className} disabled`;

  return <RouterLink {...props} to={`${BACKEND_PATH}${to}`} className={newClasses} />; // eslint-disable-line react/jsx-props-no-spreading
}

export default Link;
