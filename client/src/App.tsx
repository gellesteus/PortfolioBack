import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import Admin from './components/admin/Admin';
import Armory from './components/armory/Armory';
import Bestiary from './components/bestiary/Bestiary';
import CharsMain from './components/chars/CharsMain';
import Forum from './components/forum/Forum';
import FrontMain from './components/front/FrontMain';
import GraveMain from './components/grave/GraveMain';
import Footer from './components/layout/Footer';
import Login from './components/login/Login';
import Register from './components/login/Register';
import MapMain from './components/map/MapMain';
import Navigation from './components/nav/Navigation';
import OrganizationMain from './components/organizations/OrganizationMain';
import Profile from './components/profile/Profile';
import RulesMain from './components/rules/RulesMain';

import { useDispatch, useSelector } from 'react-redux';
import Alert from './components/error/Alert';
import Modal from './components/layout/Modal';

import Cookies from 'universal-cookie';

import { stopRedirect } from './actions';

import './app.css';

const cookies = new Cookies();

export default () => {
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch('/api/user', {
      headers: {
        Authorization: cookies.get('token'),
        'content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          dispatch({ type: 'LOGIN', payload: { user: res.user } });
        } else {
          cookies.remove('token');
        }
      })
      .catch(e => cookies.remove('token'));
  }, [dispatch]);

  return (
    <Router>
      <Redirecter />
      <Alert />
      <Modal />
      <div className="main">
        {isLoggedIn ? (
          <>
            <Navigation />
            <Switch>
              <Route exact={true} path="/" component={FrontMain} />
              <Route path="/map" component={MapMain} />
              <Route path="/grave" component={GraveMain} />
              <Route path="/characters" component={CharsMain} />
              <Route path="/organizations" component={OrganizationMain} />
              <Route path="/rules" component={RulesMain} />
              <Route path="/forum" component={Forum} />
              <Route path="/bestiary" component={Bestiary} />
              <Route path="/armory" component={Armory} />
              <Route path="/profile" component={Profile} />
              <Route
                path="/register"
                render={props => <Redirect {...props} to="/" />}
              />
              <Route
                path="/login"
                render={props => <Redirect {...props} to="/" />}
              />
              {user.role === 'admin' ? (
                <Route path="/admin" component={Admin} />
              ) : null}
              <Route render={props => <Redirect {...props} to="/" />} />
            </Switch>
          </>
        ) : (
          <Switch>
            <Route path="/login" render={props => <Login />} />
            <Route path="/register" render={props => <Register />} />
            <Route render={props => <Redirect {...props} to="/login" />} />
          </Switch>
        )}
        <Footer />
      </div>
    </Router>
  );
};

const Redirecter = () => {
  const shouldRedirect = useSelector((state: any) => state.redirect.redirect);
  const redirectURL = useSelector((state: any) => state.redirect.url);
  const [redirecting, setRedirecting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (shouldRedirect) {
      if (redirecting) {
        setRedirecting(false);
        dispatch(stopRedirect());
      } else {
        setRedirecting(true);
      }
    }
  }, [shouldRedirect, redirecting]);

  if (redirecting) {
    return <Redirect to={redirectURL} push={true} />;
  }
  return <></>;
};
