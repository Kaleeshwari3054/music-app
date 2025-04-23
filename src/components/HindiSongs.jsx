import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Bolt.css";

function HindiSongs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("/Boltse.json")
      .then((res) => res.json())
      .then((data) => {
        const hindiSongs = data.songs.filter(
          (song) => song.language === "Hindi"
        );
        setSongs(hindiSongs);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <div className="hindi-songs-container">
      <h2 className="hindi-category-title"> Hindi Songs</h2>
      <div className="hindi-song-list">
        {songs.map((song) => (
          <div key={song.id} className="hindi-song-card">
            <img
              src={song.media.cover_image_url}
              alt={song.title}
              className="hindi-music-cover"
            />
            <h3 className="hindi-song-title">{song.title}</h3>
            <p className="hindi-movie-title"> Movie: {song.album.name}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="back-btn">
              ⬅️ Back to Home
            </Link>
    </div>
  );
}

export default HindiSongs;
