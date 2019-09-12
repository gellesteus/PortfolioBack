import React from 'react';
import PropTypes from 'prop-types';

const Uploaded = props => {
  return <div />;
};

Uploaded.propTypes = {
  user: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default Uploaded;
