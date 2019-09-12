import React, { useState, useEffect } from 'react';
import Alert from '../error/Alert';
import Nav from './Nav';
import Cookies from 'universal-cookie';
import { Route } from 'react-router-dom';
import Changes from './Changes';
import Posts from './Posts';
import Uploaded from './Uploaded';
const cookies = new Cookies();

export default () => {
  const [user, setUser] = useState();
  const [alert, setAlert] = useState({ show: false, message: '', level: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/user', {
      headers: {
        'content-type': 'application/json',
        authorization: cookies.get('token'),
      },
    })
      .then(res => res.json())
      .then(res => {
        setUser(res.user);
        setLoading(false);
      })
      .catch(e =>
        setAlert({
          show: true,
          message: e.message || 'An error has occured',
          level: 'danger',
        })
      );
  }, []);

  return (
    <>
      {loading ? null : (
        <>
          <div className='left-sidebar'>
            <Nav user={user} />
          </div>
          <div className='content'>
            <Alert
              show={alert.show}
              message={alert.message}
              level={alert.level}
            />
            <Route
              path='/profile/edit'
              render={props => (
                <Changes {...props} setAlert={setAlert} user={user} />
              )}
            />
            <Route
              path='/profile/upload'
              render={props => (
                <Uploaded {...props} setAlert={setAlert} user={user} />
              )}
            />
            <Route
              path='/profile/posts'
              render={props => (
                <Posts {...props} setAlert={setAlert} user={user} />
              )}
            />
          </div>
        </>
      )}
    </>
  );
};
