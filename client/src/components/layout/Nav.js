import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Nav = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authLinks = (
        <ul>
            <li>
                <Link to="/dashboard"><i className="fas fa-user-shield"></i> Dashboard</Link>
            </li>
            <li>
                <a href="#!" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li>
                <Link to="!#">Developers</Link>
            </li>
            <li>
                <Link to="/register"><i className="fas fa-user-plus"></i> Register</Link>
            </li>
            <li>
                <Link to="/login"><i className="fas fa-sign-in-alt"></i> Login</Link>
            </li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/">
                    <i className="fas fa-code" /> DevConnector
                </Link>
            </h1>
            {!loading && (
                <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            )}
        </nav>
    );
};

Nav.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Nav);
