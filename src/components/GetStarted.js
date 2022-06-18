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

            <svg
                className="wave1"
                viewBox="0 0 1195 750"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M3.02676 854.646C-27.3329 758.691 179.135 505.86 429.5 485.5C742.456 460.05 679.08 80.154 890 40C1337.77 -62.3646 1183.63 -281.354 1248 -210.849L1217.87 721.743V820.715L222.85 862L3.02676 854.646Z"
                    fill="url(#paint0_linear_201_50)"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_201_50"
                        x1="720.359"
                        y1="186.336"
                        x2="720.359"
                        y2="861.999"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="#D789D7" />
                        <stop offset="1" stop-color="#2A3D66" />
                    </linearGradient>
                </defs>
            </svg>

            <svg
                className="wave2"
                viewBox="0 0 1076 799"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M29 807C314.5 814.5 190.667 542.094 613.315 450.869C911.695 404.795 977.416 -65.4914 1180.09 -48.1734C1342.23 -34.319 1237.05 391.966 1223.02 541.454L912.024 1176.84L821.271 1349.28L0.979896 1009.46L29 807Z"
                    fill="url(#paint0_linear_201_52)"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_201_52"
                        x1="1011.75"
                        y1="38.049"
                        x2="392.196"
                        y2="1215.34"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="#D789D7" />
                        <stop offset="1" stop-color="#2A3D66" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
