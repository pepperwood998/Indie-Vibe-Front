import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Login, Register, Home } from './routes/landing';
import { Player } from './routes/player';
import AuthContextProvider from './contexts/AuthContext';
import { UserRoute, GuestRoute } from './components/custom-routes';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <AuthContextProvider>
            <Route exact path={['/', '/home']} component={Home} />
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
