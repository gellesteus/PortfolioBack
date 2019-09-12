import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Nav = props => {
  return (
    <div className='navbar-nav-sidebar'>
      <ul className='nav-links-sidebar'>
        <li>
          <span className='nav-title-secondary'>{props.user.username}</span>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' exact to='/profile'>
            Profile
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/profile/posts'>
            View Posts
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/profile/uploads'>
            Uploaded Files
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/profile/edit'>
            Edit Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

Nav.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Nav;
