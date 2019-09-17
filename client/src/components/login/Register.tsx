import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { displayAlert, logIn } from '../../actions';
import useCSRF from '../../hooks/useCSRF';
import { Level } from '../error/Alert';

const cookies = new Cookies();

export default () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    password_ver: '',
    username: '',
  });
  const token = useCSRF();
  const dispatch = useDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* Record changes to values */
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    /* Do client side validation first */
    if (
      state.username === null ||
      state.email === null ||
      state.password === null ||
      state.password_ver === null
    ) {
      dispatch(displayAlert('Please fill out all forms', Level.DANGER));
    } else if (state.password !== state.password_ver) {
      dispatch(
        displayAlert('Please ensure that the passwords match', Level.DANGER)
      );
    } else {
      fetch('api/user', {
        body: JSON.stringify({ ...state }),
        headers: {
          CSRF: token,
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            cookies.set('token', res.user.session_token, { sameSite: 'lax' });
            dispatch(logIn(res.user));
          } else {
            dispatch(displayAlert(res.message, Level.DANGER));
          }
        })
        .catch(err => {
          dispatch(displayAlert(err.message, Level.DANGER));
        });
    }
  };
  return (
    <div className='content'>
      <p>Register Here</p>
      <br />
      <form className='row'>
        <div className='column'>
          <label htmlFor='email'> Enter your Email Address</label>
          <label htmlFor='username'>Enter a Username</label>
          <label htmlFor='password'>Enter a password</label>
          <label htmlFor='password_ver'>Enter that password again</label>
        </div>

        <div className='column'>
          <input type='email' onChange={onChange} name='email' />
          <input type='text' onChange={onChange} name='username' />
          <input type='password' onChange={onChange} name='password' />
          <input type='password' onChange={onChange} name='password_ver' />
        </div>
        <div className='row'>
          <button id='button-register' onClick={onSubmit}>
            Login
          </button>
        </div>
      </form>
      <br />
      <p>
        If you already have an account, click <Link to='/login'>here</Link> to
        login
      </p>
    </div>
  );
};
