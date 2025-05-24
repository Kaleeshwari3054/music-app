// const API_KEY = "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AiSongs.css";

const AiSongs = () => {
  const [searchTerm, setSearchTerm] = useState();
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const API_KEY = "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8";

  const handleSearch = async () => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchTerm
      )}&type=video&maxResults=8&key=${API_KEY}`;

      const response = await axios.get(url);
      setVideos(response.data.items);
      setError(null);
    } catch (err) {
      setError("API call failed: " + err.message);
      setVideos([]);
    }
  };

  const handlePlayToggle = (videoId) => {
    if (playingVideoId === videoId) {
      setPlayingVideoId(null); // pause
    } else {
      setPlayingVideoId(videoId); // play new
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h1> Song Search</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter song or artist"
        />
        <button onClick={handleSearch}>Search</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {videos.map((video) => (
            <li className="video-item" key={video.id.videoId}>
              <img
                className="thumbnail"
                src={video.snippet.thumbnails.medium.url}
                alt="Song"
              />
              <button
                className="play-btn"
                onClick={() => handlePlayToggle(video.id.videoId)}
              >
                {playingVideoId === video.id.videoId ? "Pause" : "Play"}
              </button>
              {playingVideoId === video.id.videoId && (
                <iframe
                  className="audio-player"
                  src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                  title="YouTube audio player"
                  allow="autoplay"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
         <Link to="/" className="back-btn">
                      Back to Home
                    </Link>
    </div>
  );
};

export default AiSongs;

