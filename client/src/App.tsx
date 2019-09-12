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
import Context, { Consumer, Provider } from './context';

import Cookies from 'universal-cookie';

import './app.css';

const cookies = new Cookies();

const app: React.FC = () => {
  return (
    <Provider>
      <AutoLogin />
      <Router>
        <div className="main">
          <Navigation />
          <Consumer>{console.log}</Consumer>
          <Consumer>
            {(value: any) =>
              value.state.isLoggedIn ? (
                <Switch>
                  <Route exact path="/" component={FrontMain} />
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
                  <Consumer>
                    {(value: any) => {
                      if (value.state.user.role === 'admin') {
                        return <Route path="/admin" component={Admin} />;
                      }
                    }}
                  </Consumer>
                  <Route render={props => <Redirect to="/" />} />
                </Switch>
              ) : (
                <Consumer>
                  {(value: any) => {
                    return (
                      <Switch>
                        <Route
                          path="/login"
                          render={props => (
                            <Login {...props} login={value.dispatch} />
                          )}
                        />
                        <Route
                          path="/register"
                          render={props => (
                            <Register {...props} login={value.dispatch} />
                          )}
                        />
                        <Route
                          render={props => <Redirect {...props} to="/login" />}
                        />
                      </Switch>
                    );
                  }}
                </Consumer>
              )
            }
          </Consumer>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

const AutoLogin = () => {
  const { dispatch } = useContext(Context);
  console.log(dispatch);
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

  return <div />;
};

export default app;
