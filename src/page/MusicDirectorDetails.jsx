import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
// import { db, firestore } from "../services/Firebase";
import { initializeApp } from "firebase/app";
import { useAuth } from "../context/AuthContext";
import "../styles/MusicDirectorDetailsPage.css"

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

function MusicDirectorDetails() {
  const { directorName } = useParams();
  const { currentUser } = useAuth();

  const [songs, setSongs] = useState([]);
  const [directorImage, setDirectorImage] = useState("");
  const [playingUrl, setPlayingUrl] = useState("");
  const [savedLibrary, setSavedLibrary] = useState([]);
  const audioRef = useRef(null);

  // Load songs for selected director
  useEffect(() => {
    const directorRef = ref(db, `music_director_songs/${directorName}`);
    onValue(directorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDirectorImage(data.musicDirectorImage);
        const songsArray = data.songs ? Object.values(data.songs) : [];
        // Add an id to each song
        const songsWithId = songsArray.map((song, index) => ({
          ...song,
          id: `${directorName}-${index}`, // Unique ID based on director and index
        }));
        setSongs(songsWithId);
      }
    });
  }, [directorName]);

  // Load current user's saved library
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!currentUser) return;
      try {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setSavedLibrary(data.library || []);
        }
      } catch (error) {
        console.error("Error fetching library:", error);
      }
    };
    fetchLibrary();
  }, [currentUser]);

  // Handle play/pause
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

  // Handle Save / Remove from Library
  const handleSaveToLibrary = async (song) => {
    if (!currentUser || !song) return;

    console.log("🟩 Clicked Song to Save:", song);

    const userRef = doc(firestore, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const currentLibrary = userSnap.exists() ? userSnap.data().library || [] : [];

    const isAlreadySaved = currentLibrary.some((s) => s.id === song.id);
    console.log("isAlreadySaved:", isAlreadySaved);

    let updatedLibrary;

    if (isAlreadySaved) {
      updatedLibrary = currentLibrary.filter((s) => s.id !== song.id);
      console.log(`❌ Removed from Library: ${song.title || song.album || song.movie}`);
    } else {
      updatedLibrary = [...currentLibrary, song];
      console.log(`✅ Added to Library: ${song.title || song.album || song.movie}`);
    }

    // Update Firestore with the new library data
    await setDoc(userRef, { library: updatedLibrary }, { merge: true });

    // Update local savedLibrary state based on the result
    setSavedLibrary(updatedLibrary);
  };

  // Check if song is already saved
  const isSaved = (songId) => {
    console.log("🔍 Checking if saved:", songId, savedLibrary);
    return savedLibrary.some((s) => s.id === songId);  // Check each song individually
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

        {songs.map((song) => (
          <div
            key={song.id}
            style={{
              border: "1px solid green",
              margin: "10px 20%",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
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

            <div>
              <button onClick={() => handlePlay(song.audioUrl)}>
                {playingUrl === song.audioUrl ? "Pause" : "Play"}
              </button>

              {currentUser && (
                <button
                  onClick={() => handleSaveToLibrary(song)}
                  style={{ marginLeft: "10px" }}
                >
                  {isSaved(song.id)
                    ? "Remove from Library"
                    : "Save to Library"}
                </button>
              )}
            </div>
          </div>
        ))}

        <audio ref={audioRef} controls style={{ display: "none" }}>
          <source src={playingUrl} type="audio/mp3" />
        </audio>

        <Link to="/">⬅ Back to Home</Link>
      </div>
    </div>
  );
}

export default MusicDirectorDetails;


