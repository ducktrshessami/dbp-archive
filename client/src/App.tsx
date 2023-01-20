import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";
import Archive from "./pages/Archive";
import "./App.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Archive />} />
                    <Route path="/*" element={<Navigate to="/" replace={true} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
