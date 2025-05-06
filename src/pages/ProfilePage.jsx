import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

export default function ProfileLibrary() {
  const { currentUser, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("User Profile");
  const [savedLibrary, setSavedLibrary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!currentUser) {
        console.log("No user logged in");
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const library = userSnap.data().library || [];
          console.log("Library fetched:", library);
          setSavedLibrary(library);
        } else {
          await setDoc(userRef, { library: [] });
          console.log("User document created with empty library.");
        }
      } catch (error) {
        console.error("Error fetching library:", error);
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

  const handleSaveToLibrary = async (song) => {
    if (!currentUser) {
      console.log("User not logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const existingLibrary = userSnap.exists()
        ? userSnap.data().library || []
        : [];

      const isAlreadySaved = existingLibrary.some((s) => s.id === song.id);
      const updatedLibrary = isAlreadySaved
        ? existingLibrary.filter((s) => s.id !== song.id)
        : [...existingLibrary, song];

      await setDoc(userRef, { library: updatedLibrary }, { merge: true });
      setSavedLibrary(updatedLibrary);
      console.log(
        isAlreadySaved ? "Song removed from library" : "Song added to library"
      );
    } catch (error) {
      console.error("Error updating library:", error);
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
        {/* Header */}
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

        {/*  User Info */}
        <div className="profile-content">
          {selectedCategory === "User Profile" && (
            <div className="user-info">
              <h3>User Profile</h3>
              <div className="profile-avatar">
                <img
                  src={
                    currentUser?.photoURL ||
                    "https://w0.peakpx.com/wallpaper/119/566/HD-wallpaper-ek-dhanush-ke-art-work-dhanush-indian-actor.jpg"
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

          {/* Library Songs */}
          {selectedCategory === "Library" && (
            <div className="library-list">
              <h3>Your Library</h3>
              {savedLibrary.length > 0 ? (
                <div className="library-song-grid">
                  {savedLibrary.map((song, index) => (
                    <div key={index} className="library-song-item">
                      <Link
                        to={`/song/${song.id}`}
                        className="library-song-link"
                      >
                        <img
                          src={song.media?.cover_image_url || "default.jpg"}
                          alt={song.title}
                          className="library-song-image"
                        />
                        <p>
                          <strong>{song.title}</strong> — {song.artist}
                        </p>
                      </Link>
                      <button
                        className="remove-btn"
                        onClick={() => handleSaveToLibrary(song)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Your library is empty. Add songs to your library!</p>
              )}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <Link to="/" className="back-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
