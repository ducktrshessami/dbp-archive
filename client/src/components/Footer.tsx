import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <Link to="/disclaimer">Disclaimer</Link>
        </footer>
    );
}
