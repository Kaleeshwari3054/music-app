import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function MusicDirectorDetails() {
  const { directorName } = useParams(); // From URL
  const [songs, setSongs] = useState([]);
  const [directorImage, setDirectorImage] = useState("");
  const [playingUrl, setPlayingUrl] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const db = getDatabase();
    const directorRef = ref(db, `music_director_songs/${directorName}`);

    onValue(directorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDirectorImage(data.musicDirectorImage);
        const songsArray = data.songs ? Object.values(data.songs) : [];
        setSongs(songsArray);
      }
    });
  }, [directorName]);

  const handlePlay = (url) => {
    if (playingUrl === url) {
      audioRef.current.pause();
      setPlayingUrl("");
    } else {
      setPlayingUrl(url);
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  };

  return (
    <div>
      <h2 className="director-heading" style={{ textAlign: "center" }}>
        {directorName}'s Songs
      </h2>

      <div style={{ padding: "20px" }}>
        {directorImage && (
          <img
            src={directorImage}
            alt={directorName}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              display: "block",
              margin: "100px auto 0",
              border: "3px solid #5d945f",
            }}
          />
        )}
        <div>
          {songs.map((song, index) => (
            <div
              key={index}
              style={{
                border: "1px solid green",
                margin: "10px 20%",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100px",
                  width: "400px",
                }}
              >
                <img
                  src={song.imageUrl}
                  alt="cover"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "5px",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <p>
                    <strong>Album:</strong> {song.album}
                  </p>
                  <p>
                    <strong>Movie:</strong> {song.movie}
                  </p>
                </div>
              </div>
              <button onClick={() => handlePlay(song.audioUrl)}>
                {playingUrl === song.audioUrl ? "Pause" : "Play"}
              </button>
            </div>
          ))}
        </div>

        {/* Hidden audio player */}
        <audio ref={audioRef} controls style={{ display: "none" }}>
          <source src={playingUrl} type="audio/mp3" />
        </audio>
        <Link to="/">⬅ Back to Home</Link>
      </div>
    </div>
  );
}

export default MusicDirectorDetails;
