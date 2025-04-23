
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import songData from "../json/RecentDetail.json"; 
import musicDirectorsData from "../assets/data/MusicDirector.json"; 
// import { addToPlaylist } from "../AddToPlaylist";
import { auth, db } from "../services/Firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/Routing.css";


const RecentDetails = () => {
  const location = useLocation();
  const songId = location.state?.songId;
  const song = songData.find((item) => item.id === songId);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState(() => {
    const savedLikes = localStorage.getItem("likedSongs");
    return savedLikes ? JSON.parse(savedLikes) : [];
  });
  const [playlistName, setPlaylistName] = useState("");
  const audioRefs = useRef([]);
  const currentlyPlayingRef = useRef(null);
  const [director, setDirector] = useState(null);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    if (song) {
      const foundDirector = musicDirectorsData.find((item) =>
        song.artists.music_directors.includes(item.name)
      );
      setDirector(foundDirector);
    }
  }, [song]);

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

  // const handleAddToLibrary = async () => {
  //   const user = auth.currentUser;
  //   if (!user) {
  //     alert("Login required!");
  //     return;
  //   }
  //   await addToPlaylist(user.uid, "liked", song);
  // };

  const handleAddToCustomPlaylist = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Login required!");
      return;
    }
  
    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }
  
    const playlistRef = collection(
      db,
      "users",
      user.uid,
      "playlists",
      playlistName,
      "songs"
    );
  
    const newSong = {
      id: song.id,
      title: song.title,
      duration: song.duration,
      language: song.language,
      release_date: song.release_date,
      genre: song.genre,
      artists: song.artists,
      media: song.media,
      metadata: song.metadata,
      album: song.album,
      movie: song.movie,
    };
  
    try {
      await addDoc(playlistRef, newSong);
      alert(` "${song.title}" added to playlist "${playlistName}"`);
      setPlaylistName("");
    } catch (err) {
      console.error("Error adding song to playlist:", err);
      alert("Failed to add song. Try again.");
    }
  };
  

  if (!song) return <div>Song not found</div>;

  return (
    <div className="recent-details-container">
      <h2 className="Tittlee">{song.title}</h2>
      <img src={song.media.cover_image_url} alt={song.title} />

      <div className="details-flex">
        <div className="left-section">
          <h3>Album & Movie Info</h3>
          <p><strong>Album:</strong> {song.album.name} ({song.album.release_year})</p>
          <p><strong>Movie:</strong> {song.movie.title}</p>
          <p><strong>Director:</strong> {song.movie.director}</p>
          <p><strong>Producers:</strong> {song.movie.producers.join(", ")}</p>

          <h3>Artists</h3>
          <p><strong>Singers:</strong> {song.artists.singers.join(", ")}</p>
          <p><strong>Music Directors:</strong> {song.artists.music_directors.join(", ")}</p>
          <p><strong>Lyricists:</strong> {song.artists.lyricists.join(", ")}</p>
        </div>

        <div className="right-section">
          <h3>Status</h3>
          <p><strong>Language:</strong> {song.language}</p>
          <p><strong>Duration:</strong> {song.duration} seconds</p>
          <p><strong>Release Date:</strong> {song.release_date}</p>
          <p><strong>Genre:</strong> {song.genre.join(", ")}</p>
          <p><strong>Likes:</strong> {song.metadata.likes.toLocaleString()}</p>
          <p><strong>Plays:</strong> {song.metadata.plays.toLocaleString()}</p>
        </div>
      </div>

      <div className="btn-group">
        <button className="play-btn" onClick={() => handlePlay(0)}>
          {playingIndex === 0 && isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>
        <button className="like-btn" onClick={() => toggleLike(song.id)}>
          {likedSongs.includes(song.id) ? "💔 Unlike" : "❤️ Like"}
        </button>
        {/* <button onClick={handleAddToLibrary}>+ Save to Liked</button> */}

        <input
  type="text"
  placeholder="Enter playlist name"
  value={playlistName}
  onChange={(e) => setPlaylistName(e.target.value)}
/>
<button onClick={handleAddToCustomPlaylist}>+ Add to Playlist</button>

      </div>

      <div className="song-section">
        <audio
          ref={(el) => (audioRefs.current[0] = el)}
          controls
          src={song.media.audio_url}
        />
      </div>
    </div>
  );
};

export default RecentDetails;