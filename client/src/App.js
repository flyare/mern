import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";

const App = () => {
    return (
        <Router>
            <Fragment>
                <Nav />
                <Route part="/">
                    <Landing />
                </Route>
                <section className="container">
                    <Switch>
                        <Route exact part="/register" component={Register} />
                        <Route exact part="/login" component={Login} />
                    </Switch>
                </section>
            </Fragment>
        </Router>
    );
};

export default App;
