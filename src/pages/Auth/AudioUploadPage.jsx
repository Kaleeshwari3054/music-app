// import React, { useState } from "react";
// import { initializeApp ,getApps} from "firebase/app";
// import { getDatabase, ref, push } from "firebase/database";
// import { storage, database } from "../../services/Firebase";  // Correct way


// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8",
//   authDomain: "chordify-2e659.firebaseapp.com",
//   databaseURL: "https://chordify-2e659-default-rtdb.firebaseio.com/", // <-- IMPORTANT line added
//   projectId: "chordify-2e659",
//   storageBucket: "chordify-2e659.appspot.com",
//   messagingSenderId: "271734174990",
//   appId: "1:271734174990:web:3733790be87253e33dd35f",
//   measurementId: "G-Z9KG64HFL5",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// function AudioUploadPage() {
//   const [audioUrl, setAudioUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     const audioName = document.getElementById("audioName").value;
//     const file = document.getElementById("audio-upload").files[0];

//     if (!file) {
//       alert("Please select an audio file to upload.");
//       return;
//     }
//     if (!audioName) {
//       alert("Please enter an audio name.");
//       return;
//     }
    

//     setLoading(true);

//     const cloudName = "dcuto7css";
//     const uploadPreset = "flixFusion";

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);

//     try {
//       const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();

//       if (data.secure_url) {
//         const uploadedAudioUrl = data.secure_url;
//         setAudioUrl(uploadedAudioUrl);

//         const songDetails = {
//           title: document.getElementById("title").value,
//           duration: parseInt(document.getElementById("duration").value),
//           language: document.getElementById("language").value,
//           release_date: document.getElementById("release_date").value,
//           genre: document.getElementById("genre").value.split(",").map(item => item.trim()),
//           album: {
//             name: document.getElementById("album_name").value,
//             release_year: parseInt(document.getElementById("album_year").value)
//           },
//           movie: {
//             title: document.getElementById("movie_title")?.value || "", // added optional chaining
//             director: document.getElementById("movie_director").value,
//             producers: document.getElementById("producers").value.split(",").map(item => item.trim())
//           },
//           artists: {
//             singers: document.getElementById("singers").value.split(",").map(item => item.trim()),
//             music_directors: document.getElementById("music_directors").value.split(",").map(item => item.trim()),
//             lyricists: document.getElementById("lyricists").value.split(",").map(item => item.trim())
//           },
//           media: {
//             cover_image_url: document.getElementById("cover_image_url").value,
//             audio_url: uploadedAudioUrl
//           },
//           metadata: {
//             likes: parseInt(document.getElementById("likes").value),
//             plays: parseInt(document.getElementById("plays").value)
//           }
//         };

//         try {
//           const reference = ref(db, "audios/");
//           await push(reference, {
//             audio_name: audioName,
//             ...songDetails,
//           });

//           console.log("Audio and full details saved to Firebase successfully!");
//           alert("Uploaded Successfully!");
//         } catch (error) {
//           console.error("Error saving audio data to Firebase:", error);
//           alert("Error saving audio details. See console for details.");
//         }
//       } else {
//         alert("Failed to upload the audio. Check console for errors.");
//         console.error("Upload error:", data);
//       }
//     } catch (error) {
//       console.error("Error uploading audio:", error);
//       alert("An error occurred during the upload.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>Upload and Display Audio with Full Details</h1>

//       <input type="text" id="audioName" placeholder="Enter Audio Name" style={styles.input} />
//       <input type="file" id="audio-upload" accept="audio/*" style={styles.input} />
//       <input type="text" id="title" placeholder="Enter Title" style={styles.input} />
//       <input type="number" id="duration" placeholder="Enter Duration (in seconds)" style={styles.input} />
//       <input type="text" id="language" placeholder="Enter Language" style={styles.input} />
//       <input type="text" id="release_date" placeholder="Enter Release Date (YYYY-MM-DD)" style={styles.input} />
//       <input type="text" id="genre" placeholder="Enter Genres (comma separated)" style={styles.input} />
//       <input type="text" id="album_name" placeholder="Enter Album Name" style={styles.input} />
//       <input type="number" id="album_year" placeholder="Enter Album Release Year" style={styles.input} />
//       <input type="text" id="movie_title" placeholder="Enter Movie Title" style={styles.input} />
//       <input type="text" id="movie_director" placeholder="Enter Director Name" style={styles.input} />
//       <input type="text" id="producers" placeholder="Enter Producers (comma separated)" style={styles.input} />
//       <input type="text" id="singers" placeholder="Enter Singers (comma separated)" style={styles.input} />
//       <input type="text" id="music_directors" placeholder="Enter Music Directors (comma separated)" style={styles.input} />
//       <input type="text" id="lyricists" placeholder="Enter Lyricists (comma separated)" style={styles.input} />
//       <input type="text" id="cover_image_url" placeholder="Enter Cover Image URL" style={styles.input} />
//       <input type="number" id="likes" placeholder="Enter Likes" style={styles.input} />
//       <input type="number" id="plays" placeholder="Enter Plays" style={styles.input} />

//       <button onClick={handleUpload} style={styles.button} disabled={loading}>
//         {loading ? "Uploading..." : "Upload Audio"}
//       </button>

//       <h2 style={styles.heading}>Uploaded Audio:</h2>
//       <div style={styles.audioContainer}>
//         {audioUrl && <audio src={audioUrl} controls style={styles.audio} />}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "#e9f7ef",
//     color: "#2e7d32",
//     padding: "20px",
//   },
//   heading: {
//     textAlign: "center",
//     color: "#1b5e20",
//   },
//   input: {
//     width: "100%",
//     maxWidth: "400px",
//     padding: "10px",
//     margin: "10px auto",
//     display: "block",
//     border: "2px solid #81c784",
//     borderRadius: "8px",
//     backgroundColor: "#ffffff",
//     color: "#2e7d32",
//     fontSize: "16px",
//   },
//   button: {
//     width: "100%",
//     maxWidth: "400px",
//     padding: "10px",
//     margin: "10px auto",
//     display: "block",
//     borderRadius: "8px",
//     backgroundColor: "#43a047",
//     color: "white",
//     fontWeight: "bold",
//     fontSize: "16px",
//     cursor: "pointer",
//     border: "none",
//   },
//   audioContainer: {
//     marginTop: "30px",
//     textAlign: "center",
//   },
//   audio: {
//     width: "100%",
//     maxWidth: "500px",
//     marginTop: "20px",
//   },
// };

// export default AudioUploadPage;









import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { Link } from "react-router-dom";

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

function AudioUploadPage() {
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const audioName = document.getElementById("audioName").value.trim();
    const fileInput = document.getElementById("audio-upload");
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Please select an audio file to upload.");
      return;
    }
    if (!audioName) {
      alert("Please enter an audio name.");
      return;
    }

    setLoading(true);

    const cloudName = "dcuto7css";
    const uploadPreset = "flixFusion";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        const uploadedAudioUrl = data.secure_url;
        setAudioUrl(uploadedAudioUrl);

        const songDetails = {
          title: document.getElementById("title").value.trim(),
          duration: parseInt(document.getElementById("duration").value),
          language: document.getElementById("language").value.trim(),
          release_date: document.getElementById("release_date").value.trim(),
          genre: document.getElementById("genre").value.split(',').map(item => item.trim()),
          album: {
            name: document.getElementById("album_name").value.trim(),
            release_year: parseInt(document.getElementById("album_year").value),
          },
          movie: {
            title: document.getElementById("movie_title").value.trim(),
            director: document.getElementById("movie_director").value.trim(),
            producers: document.getElementById("producers").value.split(',').map(item => item.trim()),
          },
          artists: {
            singers: document.getElementById("singers").value.split(',').map(item => item.trim()),
            music_directors: document.getElementById("music_directors").value.split(',').map(item => item.trim()),
            lyricists: document.getElementById("lyricists").value.split(',').map(item => item.trim()),
          },
          media: {
            cover_image_url: document.getElementById("cover_image_url").value.trim(),
            audio_url: uploadedAudioUrl,
          },
          metadata: {
            likes: parseInt(document.getElementById("likes").value) || 0,
            plays: parseInt(document.getElementById("plays").value) || 0,
          },
        };

        try {
          const reference = ref(db, 'audios/');
          await push(reference, { [audioName]: songDetails });
          console.log("Audio and full details saved to Firebase successfully!");
          alert("Upload successful! 🎉");
        } catch (error) {
          console.error("Error saving audio data:", error);
          alert("Failed to save audio details. Try again.");
        }

      } else {
        console.error("Upload error:", data);
        alert("Failed to upload the audio. Please check console for errors.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload and Display Audio with Full Details</h1>

      <div style={styles.formContainer}>
        <input type="text" id="audioName" placeholder="Enter Audio Name" style={styles.input} />
        <input type="file" id="audio-upload" accept="audio/*" style={styles.input} />

        <input type="text" id="title" placeholder="Enter Title" style={styles.input} />
        <input type="number" id="duration" placeholder="Enter Duration (seconds)" style={styles.input} />
        <input type="text" id="language" placeholder="Enter Language" style={styles.input} />
        <input type="text" id="release_date" placeholder="Enter Release Date" style={styles.input} />
        <input type="text" id="genre" placeholder="Enter Genres (comma separated)" style={styles.input} />
        <input type="text" id="album_name" placeholder="Enter Album Name" style={styles.input} />
        <input type="number" id="album_year" placeholder="Enter Album Release Year" style={styles.input} />
        <input type="text" id="movie_title" placeholder="Enter Movie Title" style={styles.input} />
        <input type="text" id="movie_director" placeholder="Enter Director Name" style={styles.input} />
        <input type="text" id="producers" placeholder="Enter Producers (comma separated)" style={styles.input} />
        <input type="text" id="singers" placeholder="Enter Singers (comma separated)" style={styles.input} />
        <input type="text" id="music_directors" placeholder="Enter Music Directors (comma separated)" style={styles.input} />
        <input type="text" id="lyricists" placeholder="Enter Lyricists (comma separated)" style={styles.input} />
        <input type="text" id="cover_image_url" placeholder="Enter Cover Image URL" style={styles.input} />
        <input type="number" id="likes" placeholder="Enter Likes" style={styles.input} />
        <input type="number" id="plays" placeholder="Enter Plays" style={styles.input} />

        <button onClick={handleUpload} style={styles.button} disabled={loading}>
          {loading ? "Uploading..." : "Upload Audio"}
        </button>
      </div>

      {audioUrl && (
        <>
          <h2 style={styles.heading}>Uploaded Audio:</h2>
          <div style={styles.audioContainer}>
            <audio src={audioUrl} controls style={styles.audio} />
          </div>
        </>
      )}
      <Link to="/" className="back-btn">
          Back to Home
        </Link>
        <Link to="/MusicDirectorUpload" className="MusicDirectorUpload-btn">
          MusicDirectorUploadPage
        </Link>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#e9f7ef",
    color: "#2e7d32",
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    color: "#1b5e20",
    marginBottom: "20px",
  },
  formContainer: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "2px solid #81c784",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#43a047",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
  },
  audioContainer: {
    marginTop: "30px",
    textAlign: "center",
  },
  audio: {
    width: "100%",
    maxWidth: "500px",
  },
};

export default AudioUploadPage;


