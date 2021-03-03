import React, { Fragment } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Landing from "./components/Landing";
const App = () => {
    return (
        <Fragment>
            <Nav />
            <Landing />
        </Fragment>
    );
};

export default App;
