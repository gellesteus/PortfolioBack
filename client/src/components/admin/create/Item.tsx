import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import useCSRF from '../../../hooks/useCSRF';

const cookies = new Cookies();

export default () => {
  const [state, setState] = useState({
    images: [],
    longDesc: '',
    name: '',
    shortDesc: '',
  });

  const token = useCSRF();

  const submit = (e: React.MouseEvent) => {
    // setAlert({
    //   level: 'info',
    //   message: '',
    //   show: false
    // });

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
        console.log(res);
        if (res.success) {
          // setAlert({
          //   level: 'success',
          //   message: res.message || 'Success',
          //   show: true,
          // });
        } else {
          // setAlert({
          //   level: 'danger',
          //   message: res.message || 'An unknown error occured',
          //   show: true,
          // });
        }
      })
      .catch(
        err => console.log(err.message)
        // setAlert({
        //   level: 'danger',
        //   message: err.message || 'An unknown error occured',
        //   show: true,
        // })
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
