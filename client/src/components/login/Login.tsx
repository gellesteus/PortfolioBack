import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Consumer } from '../../context';
import Alert from '../error/Alert';
import useCSRF from '../hooks/useCSRF';
import { useDispatch } from 'react-redux';
const cookies = new Cookies();

//TODO: Reqrite using redux

export interface IProps {}

export default (props: IProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = useCSRF();
  const [error, setError] = useState({ error: false, message: '' });

  const validate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!password || !email) {
      // setError({
      //   error: true,
      //   Message: 'Please enter your email and password',
      // });
    } else {
      fetch(`http://localhost:3001/user/login`, {
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
          if (res.success) {
            props.login({
              type: 'LOGIN',
              payload: {
                user: res.user,
              },
            });
            cookies.set('token', res.user.sessionToken);
          } else {
            setError({
              error: true,
              message: res.message,
            });
          }
        })
        .catch(e =>
          setError({
            error: true,
            message: 'Could not connect to server',
          })
        );
    }
  };

  return (
    <div className="content">
      <Consumer>
        {(value: any) => {
          if (value.state.isLoggedIn) {
            return <Redirect to="/" />;
          }
        }}
      </Consumer>
      <Alert show={error.error} message={error.message} level={'danger'} />
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
            placeholer="email"
            onChange={e => {
              setEmail(e.target.value);
            }}
          />

          <input
            name="password"
            type="password"
            placeholer="password"
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="spacer" />
      </form>
      <div className="form-under">
        <div className="center">
          <button href="#" id="button-login" onClick={validate}>
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
