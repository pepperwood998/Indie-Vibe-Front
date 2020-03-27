import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { GuestRoute, UserRoute } from './components/custom-routes';
import {
  AuthContextProvider,
  LibraryContextProvider,
  MeContextProvider,
  StreamContextProvider
} from './contexts';
import { Home, Login, Premium, Register } from './routes/landing';
import { Player } from './routes/player';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <AuthContextProvider>
            <MeContextProvider>
              <Route exact path={['/', '/home']} component={Home} />
              <Route exact path='/premium' component={Premium} />
              <GuestRoute path='/login' component={Login} />
              <GuestRoute path='/register' component={Register} />
              <StreamContextProvider>
                <LibraryContextProvider>
                  <UserRoute path='/player' component={Player} />
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
