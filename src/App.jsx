import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { GuestRoute, UserRoute, FreeRoute } from './components/custom-routes';
import {
  AuthContextProvider,
  LibraryContextProvider,
  MeContextProvider,
  StreamContextProvider
} from './contexts';
import NotFound from './NotFound';
import { Home, Login, Premium, Purchase, Register } from './routes/landing';
import { Player } from './routes/player';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <AuthContextProvider>
            <MeContextProvider>
              <StreamContextProvider>
                <LibraryContextProvider>
                  <Switch>
                    <Route exact path={['/', '/home']} component={Home} />
                    <Route exact path='/premium' component={Premium} />
                    <FreeRoute
                      exact
                      path='/purchase/:type/:packageType?'
                      component={Purchase}
                    />
                    <GuestRoute exact path='/login' component={Login} />
                    <GuestRoute path='/register' component={Register} />
                    <UserRoute path='/player' component={Player} />
                    <Route path='/404' component={NotFound} />
                    <Route path='*'>
                      <Redirect to='/404' />
                    </Route>
                  </Switch>
                </LibraryContextProvider>
              </StreamContextProvider>
            </MeContextProvider>
          </AuthContextProvider>
        </div>
      </Router>
    );
  }
}

export default App;
