// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./page/Homepage";
// import SongDetailsPage from "./page/SongDetailsPage.jsx";
// import ProfilePage from "./page/ProfilePage";
// import AudioUploadPage from './pages/Auth/AudioUploadPage';
// import MusicDirectorUploadPage from "./pages/Auth/MusicDirectorUploadPage";
// import MusicDirectorDetails from "./page/MusicDirectorDetails";
// import LanguageFilteredSongs from "./page/LanguageFilteredSongs";
// import AiSongs from "./page/AiSongs";
// import Signup from "./pages/Auth/Signup";
// import Login from "./pages/Auth/Login";

// const App = () => {
//   // console.log("ENV API KEY:", process.env.REACT_APP_FIREBASE_API_KEY);

//   return (

//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="/song/:id" element={<SongDetailsPage />} />
//         <Route path="/audio-upload" element={<AudioUploadPage />} />
//         <Route path="/MusicDirectorUpload" element={<MusicDirectorUploadPage />} />
//         <Route path="/MusicDirector/:directorName" element={<MusicDirectorDetails />} />
//         <Route path="/AudioUpload" element={<AudioUploadPage />} />
//         <Route path="/edit-song/:id" element={<AudioUploadPage />} />
//         <Route path="/language-songs" element={<LanguageFilteredSongs />} />
//   <Route path="/ai-songs" element={<AiSongs />} />
//         <AiSongs />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// // import React from 'react'
// // import AiSongs from './page/AiSongs'

// // const App = () => {
// //   return (
// //     // <div>App</div>
// //           <AiSongs />

// //   )
// // }

// // export default App


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/Homepage";
import SongDetailsPage from "./page/SongDetailsPage.jsx";
import ProfilePage from "./page/ProfilePage";
import AudioUploadPage from './pages/Auth/AudioUploadPage';
import MusicDirectorUploadPage from "./pages/Auth/MusicDirectorUploadPage";
import MusicDirectorDetails from "./page/MusicDirectorDetails";
import LanguageFilteredSongs from "./page/LanguageFilteredSongs";
import AiSongs from "./page/AiSongs";
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
        <Route path="/song/:id" element={<SongDetailsPage />} />
        <Route path="/audio-upload" element={<AudioUploadPage />} />
        <Route path="/MusicDirectorUpload" element={<MusicDirectorUploadPage />} />
        <Route path="/MusicDirector/:directorName" element={<MusicDirectorDetails />} />
        <Route path="/AudioUpload" element={<AudioUploadPage />} />
        <Route path="/edit-song/:id" element={<AudioUploadPage />} />
        <Route path="/language-songs" element={<LanguageFilteredSongs />} />
        <Route path="/ai-songs" element={<AiSongs />} />
      </Routes>
    </Router>
  );
};

export default App;
