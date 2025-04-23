import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import RecentDetail from "../json/RecentDetail.json";
import artistDetails from "../json/Artist.json"; 
import "../styles/Styles.css"
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);


  const allSongs = RecentDetail;
  const artistpage = artistDetails;
  useEffect(() => {
    document.title = "Chordify 🎵 - Your Personalized Music Vibes";
    const descriptionTag = document.querySelector("meta[name='description']");
    if (descriptionTag) {
      descriptionTag.setAttribute(
        "content",
        "Discover music, explore top artists and enjoy recently played songs at Chordify."
      );
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredResults([]);
    } else {
      const results = allSongs.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(query)) ||
          item.artists?.singers?.some((singer) =>
            singer.toLowerCase().includes(query)
          )
      );
      setFilteredResults(results);
    }
  };

  const recentlyPlayed = searchQuery
    ? filteredResults.slice(0, 5)
    : allSongs.slice(0, 5);

  const popularArtists = allSongs
    .filter((music) => music.media?.cover_image_url)
    .slice(0, 5);

  return (
    <div>
      <header className="header">
        {currentUser ? (
          <Link to="/profile" className="profile-icon">
            {currentUser.displayName
              ? currentUser.displayName.charAt(0).toUpperCase()
              : "U"}
          </Link>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}

        {/* ☰ Dropdown Menu */}
        <div className="menu-container">
          <button
            className="menu-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            &#9776;
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/tamilsongs" className="dropdown-item">
                Tamil Songs
              </Link>
              <Link to="/englishsongs" className="dropdown-item">
                English Songs
              </Link>
              <Link to="/hindhisongs" className="dropdown-item">
                Hindi Songs
              </Link>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search songs, artists, movies..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </header>

      <section className="main-content">
        {/* Recently Played */}
        <h2 className="section-title">Recently Played</h2>
        <div className="recently-played">
          {recentlyPlayed.map((music) => (
            <Link
              key={music.id}
              to="/recent-details"
              state={{ songId: music.id }}
              className="song-card"
            >
              <div className="image-container">
                <img
                  src={music.media?.cover_image_url}
                  alt={music.title}
                  className="song-image"
                />
                <div className="play-icon">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <p className="song-title">{music.title}</p>
              <p className="music-details">
                <strong>Music Director:</strong>{" "}
                {music.artists?.music_directors?.join(", ")}
                <br />
                <strong>Singer(s):</strong> {music.artists?.singers?.join(", ")}
                <br />
                <strong>Movie:</strong> {music.movie?.title}
              </p>
            </Link>
          ))}
        </div>

        {/* Popular Artists */}
        <div className="section-title-container">
          <h2 className="section-title">Popular Artists</h2>
          <Link to="/all-artists" className="show-all-btn">
            Show All
          </Link>
        </div>

        <div className="recently-played1">
          {artistpage.map((artist) => {
            console.log(artist);
            const isNewFormat = artist.artists && artist.media;
            const musicDirectorName = isNewFormat
              ? artist.artists.music_directors?.[0]
              : artist.musicDirector;
            const coverImage = isNewFormat
              ? artist.media.cover_image_url
              : artist.image;

            return (
              <Link
                key={artist.id}
                to={`/musicdirector/${artist.id}`}
                state={{
                  musicDirectorName: musicDirectorName,
                }}
                className="artist-card"
              >
                <div className="artist-image-container">
                  <img
                    src={coverImage}
                    alt={musicDirectorName}
                    className="artist-image"
                  />
                  <div className="artist-play-icon">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <p className="artist-name">{musicDirectorName}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;