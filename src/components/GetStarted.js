import '../css/style.css';
import { Link } from 'react-router-dom';

export default function GetStarted() {
    return (
        <div className="landing">
            <div className="landing-title-container">
                <h1 className="landing-title">Music</h1>
                <h1 className="landing-title">Shared.</h1>
                <h2 className="landing-subtitle">
                    Let others control your music
                </h2>
                <Link
                    className="get-started-button align-self-center"
                    to="/login"
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
}
