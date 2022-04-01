import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import '../css/style.css';

export default function Login() {
    // Gets Auth context
    let auth = useAuth();
    let history = useHistory();

    return (
        <div className="login">
            <div className="login-dialog">
                <div className="login-padding">
                    <p className="login-prompt">Please select an option...</p>
                    <div className="login-buttons-container">
                        <Link className="login-buttons" to="/enter-code">
                            I have a session code <br /> (Guest login)
                        </Link>
                        <button
                            className="login-buttons spotify-login"
                            onClick={() =>
                                auth.login(() => history.push('/dashboard'))
                            }
                        >
                            Login with Spotify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
