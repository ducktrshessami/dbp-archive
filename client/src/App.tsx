import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";
import Archive from "./pages/Archive";
import SelectRedirect from "./components/SelectRedirect";
import "./App.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/:channelId/:page" element={<Archive />} />
                    <Route path="/:channelId" element={<SelectRedirect />} />
                    <Route path="/" element={<Archive />} />
                    <Route path="/*" element={<Navigate to="/" replace={true} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
