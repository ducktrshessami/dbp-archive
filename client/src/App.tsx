import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";
import Archive from "./pages/Archive";
import Disclaimer from "./pages/Disclaimer";
import Footer from "./components/Footer";
import SelectRedirect from "./components/SelectRedirect";
import "./App.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/:channelId/:page" element={<Archive />} />
                    <Route path="/:channelId" element={<SelectRedirect />} />
                    <Route path="/" element={<Archive />} />
                    <Route path="/*" element={<Navigate to="/" replace={true} />} />
                </Routes>
                <Routes>
                    <Route path="/disclaimer" element={null} />
                    <Route path="/*" element={<Footer />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
