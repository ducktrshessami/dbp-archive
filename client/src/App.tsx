import { BrowserRouter } from "react-router-dom";
import Archive from "./pages/Archive";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Archive />
                <Footer />
            </BrowserRouter>
        </div>
    );
}
