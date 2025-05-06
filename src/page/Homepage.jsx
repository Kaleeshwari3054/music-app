import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";
import { Play, Pause, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import Logo from './Logo.png';
import "../styles/Home.css";

function HomePage() {
  const [songs, setSongs] = useState([]);
  const [directorSongs, setDirectorSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef(new Audio());
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // const currentSong = songs[currentSongIndex] || null;

  useEffect(() => {
    document.title = "Chordify 🎵 - Your Personalized Music Vibes";
    const db = getDatabase();

    //  All songs
    const songsRef = ref(db, "audios/");
    onValue(songsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const songsList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...Object.values(value)[0],
        }));
        setSongs(songsList);
      }
    });

    //  Songs by Music Directors
    const dirSongsRef = ref(db, "music_director_songs/");
    onValue(dirSongsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dirSongs = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setDirectorSongs(dirSongs);
      }
    });

    return () => {
      audioRef.current.pause();
    };
  }, []);

  const playSong = (index) => {
    const selectedSong = songs[index];
    if (!selectedSong) return;

    audioRef.current.pause();
    audioRef.current.src = selectedSong.media.audio_url;
    audioRef.current.play();
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = (song, index, e) => {
    e.stopPropagation();

    if (currentSongIndex === index) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      playSong(index);
    }
  };

  // const handleNext = () => {
  //   if (currentSongIndex === null || currentSongIndex === songs.length - 1)
  //     return;
  //   playSong(currentSongIndex + 1);
  // };

  // const handlePrevious = () => {
  //   if (currentSongIndex === null || currentSongIndex === 0) return;
  //   playSong(currentSongIndex - 1);
  // };

  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return (
      song.title?.toLowerCase().includes(query) ||
      song.movie?.title?.toLowerCase().includes(query) ||
      song.artists?.singers?.some((singer) =>
        singer.toLowerCase().includes(query)
      ) ||
      song.artists?.music_directors?.some((director) =>
        director.toLowerCase().includes(query)
      )
    );
  });

  const handleCardClick = (song) => {
    navigate(`/song/${song.id}`);
  };

  return (
    <div className="container">
      {/* Header */}

      <header className="heading">
        <h6 className="Logo"> 🎵Chordify</h6>
        <div className="Categories-Songs">
          <Link to="/language-songs">Categories Songs</Link>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search songs, artists, movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {currentUser ? (
          <Link to="/profile" className="profile-icon">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile"
              className="profile-image"
            />
          </Link>
        ) : (
          <Link to="/login" id="login-btn">
            Login
          </Link>
        )}
      </header>
      {/* All Songs */}

      <div className="songs-grid">
        <h2 className="Top-Heading">🎶 All Songs</h2>
        {filteredSongs.map((song, index) => (
          <div
            key={song.id}
            className="song-card"
            onClick={() => handleCardClick(song)}
          >
            <img
              src={song.media.cover_image_url || "default-cover.jpg"}
              alt={song.title}
              className="cover-image"
            />
            <div className="song-info">
              <h3 className="song-title">{song.title}</h3>
              <p className="movie-title">{song.movie.title}</p>
              <div className="controls">
                <button
                  onClick={(e) => togglePlayPause(song, index, e)}
                  className="play-button"
                >
                  {currentSongIndex === index && isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} />
                  )}
                </button>
                <div className="metadata">
                  <span>♥ {song.metadata.likes}</span>
                  <span>▶ {song.metadata.plays}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mdirector-section">
        <h2 className="Top-Heading">🎼 Music Directors</h2>
        <div className="mdirector-grid">
          {directorSongs.map((director) => (
            <div key={director.id} className="mdirector-card">
              <Link to={`/musicdirector/${director.id}`}>
                <img
                  src={
                    director.musicDirectorImage ||
                    director.imageUrl ||
                    "default-director.jpg"
                  }
                  alt={director.id}
                  className="mdirector-image"
                />
                <p>{director.id}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Now Playing */}
      {/* {currentSong && (
        <div className="now-playing">
          <div className="now-playing-content">
            <img
              src={currentSong.media.cover_image_url || "default-cover.jpg"}
              alt={currentSong.title}
              className="now-playing-image"
            />
            <div className="now-playing-info">
              <h4>{currentSong.title}</h4>
              <p>{currentSong.artists.music_directors?.join(", ")}</p>
            </div>
            <div className="now-playing-controls">
              <button onClick={handlePrevious}>
                <SkipBack size={20} />
              </button>
              <button
                onClick={(e) =>
                  togglePlayPause(currentSong, currentSongIndex, e)
                }
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={handleNext}>
                <SkipForward size={20} />
              </button>
            </div>
            <Volume2 className="volume-icon" />
          </div>
        </div>
      )} */}
    </div>
  );
}

export default HomePage;
