import React, { useEffect, useState } from "react";
import "../styles/Bolt.css";
import { Link } from "react-router-dom";

function TamilSongs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("/Boltse.json")
      .then((res) => res.json())
      .then((data) => {
        const tamilSongs = data.songs.filter(
          (song) => song.language === "Tamil"
        );
        setSongs(tamilSongs);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <div className="tamil-songs-container">
      <h2 className="tamil-category-title">🎶 Tamil Songs</h2>
      <div className="tamil-song-list">
        {songs.map((song) => (
          <div key={song.id} className="tamil-song-card">
            <img
              src={song.media.cover_image_url}
              alt={song.title}
              className="tamil-music-cover"
            />
            <h3 className="tamil-song-title">{song.title}</h3>
            <p className="tamil-movie-title"> Movie: {song.movie.title}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="back-btn">
        Back to Home
      </Link>
    </div>
  );
}

export default TamilSongs;
