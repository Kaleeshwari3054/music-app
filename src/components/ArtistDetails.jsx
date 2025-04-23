import React from "react";
import { useParams, Link } from "react-router-dom"; 
import musicData from "../assets/data/MusicData.json";
import "../styles/Styles.css";

const ArtistDetails = () => {
  const { artistName } = useParams();
  const decodedArtistName = decodeURIComponent(artistName);
  const allSongs = Object.values(musicData).flat();
  const artistSongs = allSongs.filter(song => song.artist === decodedArtistName);
  const musicDirectorGroups = {};
  artistSongs.forEach(song => {
    if (!musicDirectorGroups[song.musicDirector]) {
      musicDirectorGroups[song.musicDirector] = [];
    }
    musicDirectorGroups[song.musicDirector].push(song);
  });
  const suggestedSongs = allSongs
    .filter(song => song.artist !== decodedArtistName)
    .slice(0, 3);

  return (
    <div className="artist-details-page">
      <h2 className="artist-header">Songs of {decodedArtistName}</h2>

      {Object.entries(musicDirectorGroups).map(([director, songs]) => (
        <div key={director} className="music-director-group">
          {/* Music Director clickable */}
          <Link to={`/music-director/${encodeURIComponent(director)}`} className="music-director-link">
            <h3>{director}</h3>
          </Link>

          <div className="recently-played">
            {songs.map((song) => (
              <div key={song.id} className="song-card">
                <div className="image-container">
                  <img src={song.songimage} alt={song.songTitle} className="song-image" />
                  <div className="play-icon">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <p className="song-title">{song.songTitle}</p>
                <p className="music-details">
                  <strong>Movie:</strong> {song.movie}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h3 className="section-title">Suggested Songs</h3>
      <div className="recently-played">
        {suggestedSongs.map((song) => (
          <div key={song.id} className="song-card">
            <div className="image-container">
              <img src={song.songimage} alt={song.songTitle} className="song-image" />
              <div className="play-icon">
                <i className="fas fa-play"></i>
              </div>
            </div>
            <p className="song-title">{song.songTitle}</p>
            <p className="music-details">
              <strong>Artist:</strong> {song.artist} <br />
              <strong>Movie:</strong> {song.movie}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetails;
