import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Alert from '../error/Alert';
import Changes from './Changes';
import Nav from './Nav';
import Uploaded from './Uploaded';

const cookies = new Cookies();

export default () => {
  const [user, setUser] = useState();
  const [alert, setAlert] = useState({ show: false, message: '', level: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/user', {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setUser(res.user);
        setLoading(false);
      })
      .catch(e =>
        setAlert({
          level: 'danger',
          message: e.message || 'An error has occured',
          show: true,
        })
      );
  }, []);

  return (
    <>
      {loading ? null : (
        <>
          <div className="left-sidebar">
            <Nav user={user} />
          </div>
          <div className="content">
            <Route path="/profile/edit" render={props => <Changes />} />
            <Route path="/profile/upload" render={props => <Uploaded />} />
            <Route path="/profile/posts" render={props => <></>} />
          </div>
        </>
      )}
    </>
  );
};
