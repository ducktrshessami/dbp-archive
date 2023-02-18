import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <Link to="/disclaimer">Disclaimer</Link>
            <a href="https://github.com/ducktrshessami/dbp-archive">GitHub</a>
        </footer>
    );
}
