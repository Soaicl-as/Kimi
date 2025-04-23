import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
