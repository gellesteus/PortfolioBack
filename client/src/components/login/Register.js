import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Error from '../error/Error';
import useCSRF from '../hooks/useCSRF';

export default props => {
  const [state, setState] = useState({
    email: null,
    username: null,
    password: null,
    password_ver: null,
  });
  const token = useCSRF();
  const [error, setError] = useState({ error: false, message: null });

  const onChange = e => {
    /* Record changes to values */
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    /* Do client side validation first */
    if (
      state.username === null ||
      state.email === null ||
      state.password === null ||
      state.password_ver === null
    ) {
      setError({
        error: true,
        message: 'Please fill out all forms',
      });
    } else if (state.password !== state.password_ver) {
      setError({
        error: true,
        message: 'Passwords do not match',
      });
    } else {
      fetch('http://localhost:3001/user', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          CSRF: token,
        },
        body: JSON.stringify({ ...state }),
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            props.login({ type: 'LOGIN', payload: { user: res.user } });
          } else {
            setError({
              error: true,
              message: res.message,
            });
          }
        })
        .catch(e => {
          setError({
            error: true,
            message: e.message || e,
          });
        });
    }
  };
  return (
    <div className='content'>
      <Error err={error.error} errMessage={error.message} />
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
          <input type='email' onChange={e => onChange(e)} name='email' />
          <input type='text' onChange={e => onChange(e)} name='username' />
          <input type='password' onChange={e => onChange(e)} name='password' />
          <input
            type='password'
            onChange={e => onChange(e)}
            name='password_ver'
          />
        </div>
        <div className='row'>
          <button href='#' id='button-register' onClick={e => onSubmit(e)}>
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
