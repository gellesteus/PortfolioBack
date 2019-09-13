import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  const user = useSelector((state: any) => state.user.user);
  return (
    <div className="navbar-nav-sidebar">
      <ul className="nav-links-sidebar">
        <li>
          <span className="nav-title-secondary">{user.username}</span>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" exact={true} to="/profile">
            Profile
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/profile/posts">
            View Posts
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/profile/uploads">
            Uploaded Files
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/profile/edit">
            Edit Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
