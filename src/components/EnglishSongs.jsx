import React, { useEffect, useState } from "react";
import "../styles/Bolt.css";
import {Link } from "react-router-dom";


function EnglishSongs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("/Boltse.json")
      .then((res) => res.json())
      .then((data) => {
        const englishSongs =
          data?.songs?.filter((song) => song.language === "English") || [];
        setSongs(englishSongs);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <div className="english-songs-container">
      <h2 className="english-category-title">🎶 English Songs</h2>
      <div className="english-song-list">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div key={song.id} className="english-song-card">
              <img
                src={song?.media?.cover_image_url || "default-image-url"} // Use default if missing
                alt={song?.title || "Unknown Song"}
                className="english-music-cover"
              />
              <h3 className="english-song-title">
                {song?.title || "Unknown Title"}
              </h3>
              <p className="english-movie-title">
                Movie: {song?.movie?.title || "Unknown Movie"}
              </p>
            
            </div>
             
          ))
        ) : (
          <p>No English songs found or failed to load songs.</p>
        )}
      </div>
      <Link to="/" className="back-btn">
              ⬅️ Back to Home
            </Link>
    </div>
  );
}

export default EnglishSongs;
