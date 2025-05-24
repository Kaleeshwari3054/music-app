import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Play, Pause, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  const isAdmin = currentUser?.email === "kaleeshwari894@gmail.com";
  const [isListening, setIsListening] = useState(false);
  // const [showAIModal, setShowAIModal] = useState(false);
  // const [aiInput, setAiInput] = useState("");

 const goToAISong = () => {
    navigate("/ai-songs");
  };
  const startVoiceSearch = () => {
    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US"; // You can switch to "ta-IN" for Tamil if needed
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log("Voice Search:", speechResult);
      setSearchQuery(speechResult);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      alert("Sorry, couldn't hear properly. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };
  useEffect(() => {
    document.title = "Chordify 🎵 - Your Personalized Music Vibes";
    const db = getDatabase();

    //  All songs
    const songsRef = ref(db, "audios/");
    //real-time listener , changes
    //Firebase object that hold curent data location(snap)
    onValue(songsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const songsList = Object.entries(data).map(([key, value]) => ({
          //chnage to array   .
          id: key,
          ...Object.values(value)[0],
        }));
        setSongs(songsList); // set state
      }
    });
    const fetchAllSongs = async () => {
      try {
        // 🔹 Firebase Songs Fetch
        const songsRef = ref(db, "audios/");
        onValue(songsRef, async (snapshot) => {
          const firebaseData = snapshot.val();
          let firebaseSongs = [];
  
          if (firebaseData) {
            firebaseSongs = Object.entries(firebaseData).map(([key, value]) => ({
              id: key,
              ...Object.values(value)[0],
            }));
            console.log("🔥 Firebase Songs:", firebaseSongs);
          }
  
          // 🔹 External API Songs Fetch
          const response = await fetch("https://example.com/api/songs");
          const apiData = await response.json();
          console.log("🌐 API Songs:", apiData);
  
          // 🔹 Merge & Remove Duplicates by ID or title
          const allSongs = [...firebaseSongs];
  
          apiData.forEach((apiSong) => {
            const alreadyExists = firebaseSongs.some(
              (fsong) =>
                fsong.id === apiSong.id ||
                fsong.title.toLowerCase() === apiSong.title.toLowerCase()
            );
            if (!alreadyExists) {
              allSongs.push(apiSong);
            }
          });
  
          console.log("🎧 Combined Songs:", allSongs);
          setSongs(allSongs);
        });
      } catch (error) {
        console.error("Error fetching API Songs:", error);
      }
    };
  
    fetchAllSongs();
  
    //  Songs by Music Directors
    const dirSongsRef = ref(db, "music_director_songs/");
    //music director songs fetch
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
    // Page Close  audio stop
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
    // state update
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
    console.log(song);
    navigate(`/song/${song.id}`);
  };
  const handleDeleteSong = (e, songId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this song?")) {
      const db = getDatabase();
      const songRef = ref(db, `audios/${songId}`);
      remove(songRef)
        .then(() => {
          alert("Song deleted successfully.");
          setSongs((prevSongs) => prevSongs.filter((s) => s.id !== songId));
        })
        .catch((error) => {
          console.error("Error deleting song:", error);
          alert("Failed to delete song.");
        });
    }
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
          <button
            onClick={startVoiceSearch}
            className={`mic-button ${isListening ? "listening" : ""}`}
            aria-label="Start voice search"
          >
            🎤
          </button>
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
              {isAdmin && (
                <div className="admin-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-song/${song.id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteSong(e, song.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

       <button className="ai-box-button" onClick={goToAISong}>
        🎧 Ask
      </button>
      {/* {showAIModal && (
        <div className="ai-modal">
          <div className="ai-box">
            <h3>Ask AI 🎧</h3>
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Type a song name..."
            />
            <div className="ai-buttons">
              <button
                onClick={() => {
                  setSearchQuery(aiInput);
                  setShowAIModal(false);
                }}
              >
                Search
              </button>
              <button onClick={() => setShowAIModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )} */}

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
    </div>
  );
}

export default HomePage;
