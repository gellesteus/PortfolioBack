import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import useCSRF from '../../../hooks/useCSRF';
import { useDispatch } from 'react-redux';
import { displayAlert } from '../../../actions';
import { Level } from '../../error/Alert';
const cookies = new Cookies();

export default () => {
  const [state, setState] = useState({
    images: [],
    longDesc: '',
    name: '',
    shortDesc: '',
  });

  const token = useCSRF();

  const dispatch = useDispatch();

  const submit = (e: React.MouseEvent) => {
    e.preventDefault();
    fetch('/api/armory', {
      body: JSON.stringify(state),
      headers: {
        Authorization: cookies.get('token'),
        CSRF: token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          dispatch(displayAlert(res.message || 'Success', Level.SUCCESS));
        } else {
          dispatch(
            displayAlert(
              res.message || 'An unknown error occured',
              Level.DANGER
            )
          );
        }
      })
      .catch(err =>
        dispatch(
          displayAlert(err.message || 'An unknown error occured', Level.DANGER)
        )
      );
  };

  return (
    <div>
      <input
        type="text"
        onChange={e => setState({ ...state, name: e.target.value })}
        name="name"
      />
      <input
        type="text"
        onChange={e => setState({ ...state, shortDesc: e.target.value })}
        name="shortDesc"
      />
      <input
        type="text"
        onChange={e => setState({ ...state, longDesc: e.target.value })}
        name="longDesc"
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
};
