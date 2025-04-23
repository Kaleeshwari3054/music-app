import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/Firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

export default function ProfileLibrary() {
  const { currentUser, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("User Profile");
  const [savedLibrary, setSavedLibrary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      if (currentUser) {
        try {
          const playlistsRef = collection(
            db,
            "users",
            currentUser.uid,
            "playlists"
          );
          const playlistsSnapshot = await getDocs(playlistsRef);

          const allPlaylists = [];

          for (const doc of playlistsSnapshot.docs) {
            const playlistName = doc.id;
            const songsRef = collection(
              db,
              "users",
              currentUser.uid,
              "playlists",
              playlistName,
              "songs"
            );
            const songsSnapshot = await getDocs(songsRef);

            const songs = songsSnapshot.docs.map((s) => ({
              id: s.id,
              ...s.data(),
            }));

            allPlaylists.push({
              name: playlistName,
              songs: songs,
            });
          }

          setSavedLibrary(allPlaylists);
        } catch (error) {
          console.error("Error fetching playlists:", error);
        }
      }
    };

    fetchLibrary();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile & Library</h2>
          <p>
            Please <Link to="/login">log in</Link> to see your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-header">
          <h2>Profile & Library</h2>
          <div className="category-tabs">
            <button
              className={selectedCategory === "User Profile" ? "active" : ""}
              onClick={() => setSelectedCategory("User Profile")}
            >
              User Profile
            </button>
            <button
              className={selectedCategory === "Library" ? "active" : ""}
              onClick={() => setSelectedCategory("Library")}
            >
              Library
            </button>
          </div>
        </div>

        <div className="profile-content">
          {selectedCategory === "User Profile" && (
            <div className="user-info">
              <h3>User Profile</h3>
              <div className="profile-avatar">
                <img
                  src={
                    currentUser?.photoURL
                      ? currentUser.photoURL
                      : "https://w0.peakpx.com/wallpaper/119/566/HD-wallpaper-ek-dhanush-ke-art-work-dhanush-indian-actor.jpg"
                  }
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p>
                <strong>Username:</strong>{" "}
                {currentUser.displayName || "Unknown"}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}

          {selectedCategory === "Library" && (
            <div className="library-list">
              <h3>Your Playlists</h3>
              {savedLibrary.length > 0 ? (
                <div>
                  {savedLibrary.map((playlist) => (
                    <div key={playlist.name} className="playlist-block">
                      <h4>🎵 {playlist.name}</h4>
                      <ul>
                        {playlist.songs.map((song) => (
                          <li key={song.id} className="library-item">
                            <p>
                              <strong>Song:</strong> {song.title}
                            </p>
                            <p>
                              <strong>Movie:</strong> {song.movie.title}
                            </p>
                            <Link to={`/recent-details/${song.id}`}>
                              View Details
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Your playlists are empty. Add songs to a playlist!</p>
              )}
            </div>
          )}
        </div>

        <Link to="/" className="back-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
