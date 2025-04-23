import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/check');
      return res.data.isAuthenticated;
    } catch (err) {
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={props => 
        checkAuth().then(isAuthenticated => 
          isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
