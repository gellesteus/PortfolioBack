import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { displayAlert, logIn } from '../../actions';
import useCSRF from '../../hooks/useCSRF';
import { Level } from '../error/Alert';

const cookies = new Cookies();

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = useCSRF();
  const dispatch = useDispatch();
  const validate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!password || !email) {
      dispatch(
        displayAlert('Please enter your username and password', Level.DANGER)
      );
    } else {
      fetch(`api/user/login`, {
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          CSRF: token,
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          if (res.success) {
            cookies.set('token', res.user.session_token);
            dispatch(logIn(res.user));
          } else {
            dispatch(displayAlert(res.message, Level.DANGER));
          }
        })
        .catch((err: Error) =>
          dispatch(displayAlert(err.message, Level.DANGER))
        );
    }
  };

  return (
    <div className="content">
      <form>
        <div className="spacer" />
        <div className="form-column-labels">
          <label htmlFor="Email">Email</label>
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-column-input">
          <input
            name="email"
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />

          <input
            name="password"
            type="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="spacer" />
      </form>
      <div className="form-under">
        <div className="center">
          <button id="button-login" onClick={validate}>
            Login
          </button>

          <p>
            If you do not have an account, click{' '}
            <Link to="/register">Here</Link> to register
          </p>
        </div>
      </div>
    </div>
  );
};
