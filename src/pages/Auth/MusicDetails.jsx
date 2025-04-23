import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaMusic,
  FaCompactDisc,
  FaCalendarAlt,
  FaClock,
  FaHeart,
  FaPlay,
} from "react-icons/fa";
import { BsMic } from "react-icons/bs";
import { MdLyrics, MdMovie } from "react-icons/md";
import "../../styles/Bolt.css";

function MusicDetails() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  useEffect(() => {
    fetch("/Bolt.json")
      .then((res) => res.json())
      .then((data) => {
        const foundSong = data.find((item) => item.id === id);
        setSong(foundSong);
      });
  }, [id]);
  if (!song) return <p className="loading">Loading song details...</p>;

  return (
    <div className="music-info">
      <h2 className="song-title">{song.title}</h2>
      <img
        src={song.media.cover_image_url}
        alt={song.title}
        className="music-cover"
      />
      <div className="details-grid">
        <div className="details-left">
          <p>
            <BsMic /> <strong>Singers:</strong>{" "}
            {song.artists.singers.join(", ")}
          </p>
          <p>
            <FaMusic /> <strong>Music Director:</strong>{" "}
            {song.artists.music_directors.join(", ")}
          </p>
          <p>
            <MdLyrics /> <strong>Lyrics:</strong>{" "}
            {song.artists.lyricists.join(", ")}
          </p>
          <p>
            <FaCompactDisc /> <strong>Album:</strong> {song.album.name} (
            {song.album.release_year})
          </p>
        </div>
        <div className="details-right">
          <p>
            <MdMovie /> <strong>Movie:</strong> {song.movie.title}
          </p>
          <p>
            <FaCalendarAlt /> <strong>Release Date:</strong> {song.release_date}
          </p>
          <p>
            <FaClock /> <strong>Duration:</strong> {song.duration} sec
          </p>
          <p>
            <FaHeart color="red" /> <strong>Likes:</strong>{" "}
            {song.metadata.likes.toLocaleString()} &nbsp;
            <FaPlay color="green" /> <strong>Plays:</strong>{" "}
            {song.metadata.plays.toLocaleString()}
          </p>
        </div>
      </div>
      <audio
        controls
        className="audio-player"
        src={song.media.audio_url}
      ></audio>
    </div>
  );
}

export default MusicDetails;
