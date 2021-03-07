import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";
// Redux
import { Provider} from 'react-redux';
import store from './store';
import Alert from "./components/layout/Alert";

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Nav />
        <Route exact path="/">
          <Landing />
        </Route>
        <section className="container">
        <Alert />
          <Switch>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
          </Switch>
        </section>
      </Fragment>
    </Router>
    </Provider>
  );
};
export default App;
