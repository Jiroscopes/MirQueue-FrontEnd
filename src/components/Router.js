import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GetStarted from './GetStarted';
import EnterCode from './EnterCode';
import Dashboard from './Dashboard';
import Login from './Login';
import React from 'react';
import PrivateRoute from './PrivateRoute';
import AuthProvider from './AuthProvider';
import SessionRoom from './SessionRoom';
import NavWrapper from './NavWrapper';
import NotificationBar from './NotificationBar';

//const Home = NavWrapper(Dashboard);
const Session = NotificationBar(NavWrapper(SessionRoom));
const Home = NotificationBar(NavWrapper(Dashboard));
// Switch checks the routes in order
const Router = () => (
    <AuthProvider>
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <GetStarted />
                </Route>
                <Route path="/login" exact>
                    <Login />
                </Route>
                <Route path="/enter-code" exact>
                    <EnterCode />
                </Route>
                <PrivateRoute
                    path="/session/:host/:sessionCode"
                    component={Session}
                    exact
                />
                <PrivateRoute component={Home} path="/dashboard" exact />
            </Switch>
        </BrowserRouter>
    </AuthProvider>
);

export default Router;
