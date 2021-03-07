import { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = ({ login }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div>
            <h1 className="large text-primary">Login</h1>
            <form className="form">
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                    />
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image,
                        use a Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength={6}
                        value={password}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    defaultValue="Register"
                    value="Login"
                    onSubmit={onSubmit}
                />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/register">Sign In</Link>
            </p>
        </div>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
};

export default connect(null, { login })(Login);
