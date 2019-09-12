import React from 'react';
import { NavLink as Link } from 'react-router-dom';
export default () => {
  return (
    <div className='navbar-nav-sidebar'>
      <ul className='nav-links-sidebar'>
        <li>
          <span className='nav-title-secondary'>Admin Dashboard</span>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin'>
            Main Panel
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/stats'>
            Site Statistics
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/users'>
            Users
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/forum/category'>
            Forum Category Management
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/create/item'>
            Create Items
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/create/characters'>
            Create Characters
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/create/monster'>
            Create Monsters
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/create/organization'>
            Create Organization
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin/create/location'>
            Create Locations
          </Link>
        </li>
      </ul>
    </div>
  );
};
