import React, { useState, useEffect } from 'react';
import { NavLink as Link, Redirect } from 'react-router-dom';
import { Consumer } from '../../context';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export default () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    /* Stop redirecting */
    setRedirect(false);
  }, [redirect]);

  return (
    <nav className='header'>
      {redirect ? <Redirect to='/login' /> : null}
      <ul className='navbar-nav'>
        <li>
          <Link to='/' className='nav-item nav-title'>
            <Consumer>{value => value.state.heading}</Consumer>
          </Link>
        </li>
        <Consumer>
          {value => {
            /* Render the navbar links if the user is logged in */
            if (value.state.isLoggedIn) {
              return (
                <div className='nav-links'>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/characters'>
                      Characters
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/map'>
                      Maps
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/grave'>
                      Graves
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/organizations'>
                      Organizations
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/rules'>
                      Rules
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/bestiary'>
                      Bestiary
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/armory'>
                      Armory
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/forum'>
                      Forum
                    </Link>
                  </li>
                  <li>
                    <Consumer>
                      {value => (
                        <div className='dropdown nav-item'>
                          <span className='nav-link'>
                            {value.state.user.username}
                          </span>
                          <div className='dropdown-content'>
                            <ul>
                              <li className='nav-item'>
                                <Link className='nav-link' to='/profile'>
                                  Profile
                                </Link>
                              </li>
                              <Consumer>
                                {value => {
                                  if (value.state.user.role === 'admin') {
                                    return (
                                      <li className='nav-item'>
                                        <Link className='nav-link' to='/admin'>
                                          Admin
                                        </Link>
                                      </li>
                                    );
                                  }
                                }}
                              </Consumer>
                              <li className='nav-item'>
                                <p
                                  className='nav-link'
                                  onClick={e => {
                                    fetch(`http://localhost:3001/user/logout`, {
                                      method: 'POST',
                                      headers: {
                                        'content-type': 'application/json',
                                        authorization: cookies.get('token'),
                                      },
                                    });
                                    value.dispatch({
                                      type: 'LOGOUT',
                                      payload: {},
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
                      )}
                    </Consumer>
                  </li>
                </div>
              );
            } else {
              return null;
            }
          }}
        </Consumer>
      </ul>
    </nav>
  );
};
