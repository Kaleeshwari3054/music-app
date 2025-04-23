import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./styles/Bolt.css";
import AllArtist from "./components/ArtistPage";
import RecentDetails from "./components/RecentDetails";
import ProfilePage from "./pages/ProfilePage";
import MusicDirectorDetails from "./components/MusicDirectorDetails";
import TamilSongs from "./components/TamilSongs";
import HindiSongs from "./components/HindiSongs";
import EnglishSongs from "./components/EnglishSongs";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/music-director/:name"
          element={<MusicDirectorDetails />}
        />
        <Route path="/musicdirector/:id" element={<MusicDirectorDetails />} />
        <Route path="/recent-details" element={<RecentDetails />} />
        <Route path="/all-artists" element={<AllArtist />} />
        <Route path="/tamilsongs" element={<TamilSongs />} />
        <Route path="/englishsongs" element={<EnglishSongs />} />
        <Route path="/hindhisongs" element={<HindiSongs />} />
      </Routes>
    </Router>
  );
};

export default App;
