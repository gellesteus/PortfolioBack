import React, { useContext, useEffect } from 'react';
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

import Alert from './components/error/Alert';
import Modal from './components/layout/Modal';
import { useDispatch, useSelector } from 'react-redux';

import Cookies from 'universal-cookie';

import './app.css';

const cookies = new Cookies();

export default () => {
  const isLoggedIn = useSelector((state: any) => state.userReducer.isLoggedIn);
  const user = useSelector((state: any) => state.userReducer.user);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://localhost:3001/user', {
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
              <Route path="/login" render={props => <Redirect to="/" />} />
              {user.role === 'admin' ? (
                <Route path="/admin" component={Admin} />
              ) : null}
              <Route render={props => <Redirect to="/" />} />
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
