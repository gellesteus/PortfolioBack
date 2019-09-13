import React, { useEffect, useState } from 'react';
import { NavLink as Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Consumer } from '../../context';

const cookies = new Cookies();
export default () => {
  const isLoggedIn = useSelector((state: any) => state.userReducer.isLoggedIn);
  const username = useSelector((state: any) => state.userReducer.user.username);
  const role = useSelector((state: any) => state.userReducer.user.role);

  return (
    <nav className="header">
      <ul className="navbar-nav">
        <li>
          <Link to="/" className="nav-item nav-title">
            The Chain
          </Link>
        </li>
        <div className="nav-links">
          <li className="nav-item">
            <Link className="nav-link" to="/characters">
              Characters
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/map">
              Maps
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/grave">
              Graves
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/organizations">
              Organizations
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/rules">
              Rules
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/bestiary">
              Bestiary
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/armory">
              Armory
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/forum">
              Forum
            </Link>
          </li>
          <li>
            <div className="dropdown nav-item">
              <span className="nav-link">{username}</span>
              <div className="dropdown-content">
                <ul>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                  {role === 'admin' ? (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        Admin
                      </Link>
                    </li>
                  ) : null}
                  }}
                  <li className="nav-item">
                    <p
                      className="nav-link"
                      onClick={e => {
                        fetch(`http://localhost:3001/user/logout`, {
                          headers: {
                            authorization: cookies.get('token'),
                            'content-type': 'application/json',
                          },
                          method: 'POST',
                        });
                        value.dispatch({
                          payload: {},
                          type: 'LOGOUT',
                        });
                        setRedirect(true);
                      }}
                    >
                      Logout
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </div>
        )
      </ul>
    </nav>
  );
};
