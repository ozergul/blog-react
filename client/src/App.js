import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import HomePage from './components/HomePage'
import PostDetail from './components/PostDetail'
import LoginForm from './components/Auth/LoginForm'
import AdminRouter from './components/admin/AdminRouter'
import {getToken} from "./helpers/token-helper"

const isAuthenticated = () => {
    return !!getToken();
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated() ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }}/>
        )
    )} />
)

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                <PrivateRoute path="/admin" component={AdminRouter} />

                
                <Route exact path="/" component={HomePage} />
                <Route exact path="/page/:pageId" component={HomePage} />
                <Route exact path="/login" component={LoginForm} />
                <Route exact path="/:slug" component={PostDetail} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App;