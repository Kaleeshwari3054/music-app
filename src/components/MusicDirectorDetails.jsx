import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import musicDirectorsData from "../assets/data/MusicDirector.json";
import "../styles/musicDirector.css";
import { db } from "../services/Firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/musicDirector.css";

const MusicDirectorDetails = () => {
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const [likedSongs, setLikedSongs] = useState(() => {
    const savedLikes = localStorage.getItem("likedSongs");
    return savedLikes ? JSON.parse(savedLikes) : [];
  });

  const currentlyPlayingRef = useRef(null);
  const audioRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    const foundDirector = musicDirectorsData.find(
      (item) => item.id === parseInt(id)
    );
    setDirector(foundDirector);
  }, [id]);

  const toggleLike = (songId) => {
    if (likedSongs.includes(songId)) {
      setLikedSongs(likedSongs.filter((id) => id !== songId));
    } else {
      setLikedSongs([...likedSongs, songId]);
    }
  };

  const handlePlay = (index) => {
    const audio = audioRefs.current[index];

    if (currentlyPlayingRef.current && currentlyPlayingRef.current !== audio) {
      currentlyPlayingRef.current.pause();
    }

    if (currentlyPlayingRef.current === audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      currentlyPlayingRef.current = audio;
      audio.play();
      setIsPlaying(true);
    }

    setPlayingIndex(index);
  };

  const handleShuffle = () => {
    if (!director || !director.songs.length) return;
    const randomIndex = Math.floor(Math.random() * director.songs.length);
    handlePlay(randomIndex);
  };

  const addToLibrary = async (song) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to save to your library");
      return;
    }

    try {
      await addDoc(collection(db, "library"), {
        uid: user.uid,
        songId: song.id,
        title: song.title,
        movie: song.movie,
        songUrl: song.songUrl,
        image: song.image,
        director: director.name,
        timestamp: new Date()
      });

      alert("Song added to library!");
    } catch (error) {
      console.error("Error adding song:", error);
      alert("Failed to save. Try again.");
    }
  };

  if (!director) return <p>Loading...</p>;

  return (
    <div className="page-wrapper">
      <div className="director-profile">
        <img
          src={director.image}
          alt={director.name}
          className="director-img"
        />
        <h2 className="director-name">{director.name}</h2>
        <button className="shuffle-btn" onClick={handleShuffle}>
          🔀 Shuffle
        </button>
      </div>

      <h3 className="section-title">Songs</h3>
      <div className="track-list">
        {director.songs.map((song, index) => (
          <div key={song.id} className="track-card">
            <img src={song.image} alt={song.title} className="track-img" />
            <div className="track-info">
              <p>
                <strong>{song.title}</strong> - {song.movie}
              </p>
              <div className="btn-group">
                <button className="play-btn" onClick={() => handlePlay(index)}>
                  {playingIndex === index && isPlaying ? "⏸ Pause" : "▶️ Play"}
                </button>

                <button
                  className="like-btn"
                  onClick={() => toggleLike(song.id)}
                >
                  {likedSongs.includes(song.id) ? "💔 Unlike" : "❤️ Like"}
                </button>

                <button
                  className="save-button"
                  onClick={() => addToLibrary(song)}
                >
                  + Save to Library
                </button>
                <button>Add playlistssss</button>
              </div>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.songUrl}
              />
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="back-btn">
        ⬅️ Back to Home
      </Link>
    </div>
  );
};

export default MusicDirectorDetails;

