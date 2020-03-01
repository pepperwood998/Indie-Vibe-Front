import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Login, Register, Home } from './routes/landing';
import { Player } from './routes/player';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <Route exact path={['/', '/home']} component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/player' component={Player} />
        </div>
      </Router>
    );
  }
}

export default App;
