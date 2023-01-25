import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import Archive from "./pages/Archive";
import Disclaimer from "./pages/Disclaimer";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/*" element={<Archive />} />
                </Routes>
                <Routes>
                    <Route path="/disclaimer" element={null} />
                    <Route path="/*" element={<Footer />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
