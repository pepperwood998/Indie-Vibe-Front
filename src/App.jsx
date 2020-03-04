import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Login, Register, Home } from './routes/landing';
import { Player } from './routes/player';
import { UserRoute, GuestRoute } from './components/custom-routes';
import { MeContextProvider, AuthContextProvider } from './contexts';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <AuthContextProvider>
            <MeContextProvider>
              <Route exact path={['/', '/home']} component={Home} />
            </MeContextProvider>
            <GuestRoute path='/login' component={Login} />
            <GuestRoute path='/register' component={Register} />
            <UserRoute path='/player' component={Player} />
          </AuthContextProvider>
        </div>
      </Router>
    );
  }
}

export default App;
