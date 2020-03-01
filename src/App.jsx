import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={} />
          <Route path='/home' component={} />
          {/* Add all your remaining routes here, like /trending, /about, etc. */}
        </div>
      </Router>
    );
  }
}

export default App;
