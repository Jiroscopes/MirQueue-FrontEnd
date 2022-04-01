import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthProvider';

// Check if user can access the route
const PrivateRoute = ({ component: Component, ...args }) => {
    let auth = useAuth();
    return (
        <Route
            {...args}
            render={(props) =>
                auth.user ? <Component {...props} /> : <Redirect to="/login" />
            }
        ></Route>
    );
};

export default PrivateRoute;
