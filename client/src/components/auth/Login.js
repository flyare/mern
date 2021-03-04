import { Link } from "react-router-dom";
const Login = () => {
    return (
        <div>
            <h1 className="large text-primary">Login</h1>            
            <form className="form">
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
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
                    />
                </div>                
                <input
                    type="submit"
                    className="btn btn-primary"
                    defaultValue="Register"
                />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/register">Sign In</Link>
            </p>
        </div>
    );
};

export default Login;
