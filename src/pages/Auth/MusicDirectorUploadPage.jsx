// export default MusicDirectorUploadPage;
import React, { useState } from "react";
import { ref, push, set, child } from "firebase/database";
import { Link } from "react-router-dom";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8",
  authDomain: "chordify-2e659.firebaseapp.com",
  projectId: "chordify-2e659",
  storageBucket: "chordify-2e659.appspot.com",
  messagingSenderId: "271734174990",
  appId: "1:271734174990:web:3733790be87253e33dd35f",
  measurementId: "G-Z9KG64HFL5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function MusicDirectorUploadPage() {
  const [songs, setSongs] = useState([{ album: "", movie: "", imageUrl: "", file: null }]);
  const [musicDirectorName, setMusicDirectorName] = useState("");
  const [directorImage, setDirectorImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  const handleFileChange = (index, file) => {
    const updatedSongs = [...songs];
    updatedSongs[index].file = file;
    setSongs(updatedSongs);
  };

  const addAnotherSong = () => {
    setSongs([...songs, { album: "", movie: "", imageUrl: "", file: null }]);
  };

  const handleUpload = async () => {
    if (!musicDirectorName || !directorImage) {
      alert("Please enter Music Director Name and Image URL.");
      return;
    }

    setLoading(true);
    const cloudName = "dcuto7css";
    const uploadPreset = "flixFusion";

    try {
      const directorRef = ref(db, `music_director_songs/${musicDirectorName}`);
      await set(child(directorRef, "musicDirectorImage"), directorImage);

      const songsRef = child(directorRef, "songs");

      for (const song of songs) {
        if (!song.file) {
          throw new Error(`File is missing for the song: ${song.album}`);
        }

        const formData = new FormData();
        formData.append("file", song.file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        console.log("Cloudinary upload response:", data);

        if (!response.ok || !data.secure_url) {
          throw new Error("Upload failed for one of the songs.");
        }

        const songData = {
          album: song.album,
          movie: song.movie,
          imageUrl: song.imageUrl,
          audioUrl: data.secure_url,
        };

        await push(songsRef, songData);
      }

      alert("All songs uploaded successfully!");
      setSongs([{ album: "", movie: "", imageUrl: "", file: null }]);
      setMusicDirectorName("");
      setDirectorImage("");
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Something went wrong: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Music Director Song Upload</h2>

      <input
        type="text"
        placeholder="🎵 Music Director Name"
        value={musicDirectorName}
        onChange={(e) => setMusicDirectorName(e.target.value)}
        style={{ marginBottom: "10px", width: "300px" }}
      /><br />

      <input
        type="text"
        placeholder="🖼️ Music Director Image URL"
        value={directorImage}
        onChange={(e) => setDirectorImage(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      /><br />

      {songs.map((song, index) => (
        <div key={index} style={{ marginBottom: "20px", border: "1px solid green", padding: "10px" }}>
          <input
            type="text"
            placeholder="Album Name"
            value={song.album}
            onChange={(e) => handleInputChange(index, "album", e.target.value)}
          /><br />

          <input
            type="text"
            placeholder="Movie Name"
            value={song.movie}
            onChange={(e) => handleInputChange(index, "movie", e.target.value)}
          /><br />

          <input
            type="text"
            placeholder="Cover Image URL"
            value={song.imageUrl}
            onChange={(e) => handleInputChange(index, "imageUrl", e.target.value)}
          /><br />

          <input
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => handleFileChange(index, e.target.files[0])}
          /><br />
        </div>
      ))}

      <button onClick={addAnotherSong}>+ Add Another Song</button><br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Songs"}
      </button>

      <br /><br />
      <Link to="/">⬅ Back to Home</Link>
      <Link to="/AudioUpload" className="AudioUpload-btn">
        AudioUploadPage
      </Link>
    </div>
  );
}

export default MusicDirectorUploadPage;


