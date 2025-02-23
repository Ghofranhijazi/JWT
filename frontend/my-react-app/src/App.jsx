import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import UserProfile from "./UserProfile";
import AuthPage from "./AuthPage";

function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Router>
    );
}

export default App
