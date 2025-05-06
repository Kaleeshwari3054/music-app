import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getDatabase, ref, get, set } from "firebase/database";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useAuth } from "../context/AuthContext";
import "../styles/SongDetailsPage.css";

const firebaseConfig = {
  apiKey: "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8",
  authDomain: "chordify-2e659.firebaseapp.com",
  projectId: "chordify-2e659",
  storageBucket: "chordify-2e659.appspot.com",
  messagingSenderId: "271734174990",
  appId: "1:271734174990:web:3733790be87253e33dd35f",
  measurementId: "G-Z9KG64HFL5",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

function SongDetailsPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [song, setSong] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedLibrary, setSavedLibrary] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const songRef = ref(db, `audios/${id}`);
    get(songRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const songDetails = Object.values(data)[0];
          const fullSongDetails = { ...songDetails, id: Object.keys(data)[0] };
          setSong(fullSongDetails);
          setLikes(songDetails.metadata?.likes || 0);
        } else {
          console.error("Song not found");
        }
      })
      .catch((error) => console.error("Error fetching song:", error));
  }, [id]);

  //  Load Library from Firestore
  useEffect(() => {
    if (!currentUser) return;
    const fetchLibrary = async () => {
      try {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setSavedLibrary(data.library || []);
        }
      } catch (error) {
        console.error("Error loading library:", error);
      }
    };
    fetchLibrary();
  }, [currentUser]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleLikeToggle = () => {
    const newLikeCount = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikeCount);
    setIsLiked(!isLiked);

    const metadataRef = ref(db, `audios/${id}/metadata`);
    set(metadataRef, { likes: newLikeCount }).catch((err) =>
      console.error("Error updating likes:", err)
    );
  };

  const handleSaveToLibrary = async (song) => {
    if (!currentUser || !song) return;
    const userRef = doc(firestore, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const currentLibrary = userSnap.exists()
      ? userSnap.data().library || []
      : [];
    const isAlreadySaved = currentLibrary.some((s) => s.id === song.id);
    let updatedLibrary;

    if (isAlreadySaved) {
      updatedLibrary = currentLibrary.filter((s) => s.id !== song.id);
      console.log(" Removed from Library");
    } else {
      updatedLibrary = [...currentLibrary, song];
      console.log(" Added to Library");
    }

    await setDoc(userRef, { library: updatedLibrary }, { merge: true });
    setSavedLibrary(updatedLibrary);
  };

  if (!song) return <div>Loading song details...</div>;

  const isSaved = savedLibrary.some((s) => s.id === song.id);

  return (
    <div>
      <h1 className="song-details-title">{song.title}</h1>

      <div className="song-details-container">
        <img
          src={song.media?.cover_image_url || "default.jpg"}
          alt={song.title}
          className="song-cover-image"
        />

        <div className="info-section">
          <div className="info-left">
            <h2>Album & Movie Info</h2>
            <p>
              <strong>Album:</strong> {song.album?.name}
            </p>
            <p>
              <strong>Year:</strong> {song.album?.release_year}
            </p>
            <p>
              <strong>Movie:</strong> {song.movie?.title}
            </p>
            <p>
              <strong>Director:</strong> {song.movie?.director}
            </p>
            <p>
              <strong>Producers:</strong> {song.movie?.producers?.join(", ")}
            </p>

            <h2>Artists</h2>
            <p>
              <strong>Singers:</strong> {song.artists?.singers?.join(", ")}
            </p>
            <p>
              <strong>Music Directors:</strong>{" "}
              {song.artists?.music_directors?.join(", ")}
            </p>
            <p>
              <strong>Lyricists:</strong> {song.artists?.lyricists?.join(", ")}
            </p>
          </div>

          <div className="info-right">
            <h2>Status</h2>
            <p>
              <strong>Language:</strong> {song.language}
            </p>
            <p>
              <strong>Duration:</strong> {song.duration} seconds
            </p>
            <p>
              <strong>Release Date:</strong> {song.release_date}
            </p>
            <p>
              <strong>Genre:</strong> {song.genre?.join(", ")}
            </p>
            <p>
              <strong>Likes:</strong> {likes}
            </p>
            <p>
              <strong>Plays:</strong> {song.metadata?.plays}
            </p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="play-pause-button" onClick={handlePlayPause}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button className="like-button" onClick={handleLikeToggle}>
            {isLiked ? "❤️ Unlike" : "❤️ Like"}
          </button>

          {currentUser && (
            <button
              className="save-button"
              onClick={() => handleSaveToLibrary(song)}
            >
              {isSaved ? "Remove from Library" : "Save to Library"}
            </button>
          )}
        </div>

        <div className="audio-player">
          <audio ref={audioRef}>
            <source src={song.media?.audio_url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <Link to="/">⬅ Back to Home</Link>
      </div>
    </div>
  );
}

export default SongDetailsPage;
