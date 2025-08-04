import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function Link(props) {
  // TODO: depricated can prob get rid of this
  const { to, onClick, className } = props;
  const newClasses = to || onClick ? className : `${className} disabled`;

  return <RouterLink {...props} to={`${to}`} className={newClasses} />; // eslint-disable-line react/jsx-props-no-spreading
}

export default Link;
