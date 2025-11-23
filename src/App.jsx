// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage"; // <- this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />  {/* <- important */}
        {/* ...login/signup etc */}
      </Routes>
    </Router>
  );
}

export default App;
