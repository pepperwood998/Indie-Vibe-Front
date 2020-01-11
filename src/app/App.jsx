import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Demo } from './demo';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Demo} />
          <Route path='/demo' component={Demo} />
          {/* Add all your remaining routes here, like /trending, /about, etc. */}
        </div>
      </Router>
    );
  }
}

export default App;
