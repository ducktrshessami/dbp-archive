import { Link } from "react-router-dom";
import "./Disclaimer.css";

export default function Disclaimer() {
    return (
        <main className="disclaimer">
            <Link to="/">❮ Home</Link>
            <div className="disclaimer-message"></div>
        </main>
    );
}
