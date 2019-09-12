import React from 'react';
import PropTypes from 'prop-types';
/* Component for making changes to a user */
const Changes = props => {
  return (
    <div>
      <button
        onClick={e =>
          props.setAlert({ show: true, message: 'Reducerino', level: 'info' })
        }
      >
        Test
      </button>
    </div>
  );
};

Changes.propTypes = {
  user: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default Changes;
