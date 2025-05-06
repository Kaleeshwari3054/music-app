import React, { useEffect, useState, useRef } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const LanguageFilterPage = () => {
  const [songs, setSongs] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const db = getDatabase();
    const songsRef = ref(db, "audios/");

    onValue(songsRef, (snapshot) => {
      const data = snapshot.val();
      const allSongs = [];

      if (data) {
        Object.values(data).forEach((entry) => {
          const songKey = Object.keys(entry)[0];
          const song = Object.values(entry)[0];
          allSongs.push({
            id: songKey,
            title: song.title,
            language: song.language,
            album: song.album?.name || "",
            audioUrl: song.media?.audio_url,
            coverImageUrl: song.media?.cover_image_url,
            duration: song.duration,
          });
        });
        setSongs(allSongs);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      const filtered = songs.filter(
        (song) => song.language === selectedLanguage
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs([]);
    }
  }, [selectedLanguage, songs]);

  const handlePlayPause = (url) => {
    if (audioRef.current) {
      if (currentPlayingUrl === url) {
        audioRef.current.pause();
        setCurrentPlayingUrl("");
        console.log("Paused:", url);
      } else {
        setCurrentPlayingUrl(url);
        audioRef.current.src = url;
        audioRef.current.play();
        console.log("Playing:", url);
      }
    }
  };

  const languages = ["Tamil", "Hindi", "English"];

  return (
    <div style={{ padding: "40px 20px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center", color: "#2e7d32" }}>
        Filter Songs by Language
      </h2>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        {languages.map((lang, index) => (
          <button
            key={index}
            onClick={() => setSelectedLanguage(lang)}
            style={{
              marginRight: "12px",
              padding: "10px 20px",
              backgroundColor:
                selectedLanguage === lang ? "#2e7d32" : "#ffffff",
              color: selectedLanguage === lang ? "#ffffff" : "#2e7d32",
              border: "2px solid #2e7d32",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {lang}
          </button>
        ))}
      </div>

      <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Showing songs for:{" "}
        <span style={{ color: "#2e7d32" }}>
          {selectedLanguage || "None selected"}
        </span>
      </h3>

      {filteredSongs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>No songs found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "0 15%",
          }}
        >
          {filteredSongs.map((song, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #2e7d32",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#f9fdf9",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={song.coverImageUrl}
                  alt={song.title}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "15px",
                    border: "2px solid #5d945f",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    {song.title}
                  </p>
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    Album: {song.album}
                  </p>
                  <p style={{ fontSize: "14px", color: "#777" }}>
                    Duration: {song.duration}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handlePlayPause(song.audioUrl)}
                style={{
                  backgroundColor:
                    currentPlayingUrl === song.audioUrl ? "#c62828" : "#2e7d32",
                  color: "#fff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "0.3s",
                }}
              >
                {currentPlayingUrl === song.audioUrl ? "Pause" : "Play"}
              </button>
            </div>
          ))}
        </div>
      )}

      <audio ref={audioRef} />
    </div>
  );
};

export default LanguageFilterPage;
