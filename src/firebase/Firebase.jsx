import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

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

// Function to save song data
export function saveSongData(songId, songDetails) {
  const songRef = ref(db, "songs/" + songId);
  set(songRef, songDetails)
    .then(() => {
      console.log("Song data saved successfully!");
    })
    .catch((error) => {
      console.error("Error saving song data: ", error);
    });
}

// Export db if you need to fetch data elsewhere
export { db };


//  <button className="ai-box-button" onClick={() => setShowAIModal(true)}>
//         🎧 Ask AI
//       </button>
//       {showAIModal && (
//         <div className="ai-modal">
//           <div className="ai-box">
//             <h3>Ask AI 🎧</h3>
//             <input
//               type="text"
//               value={aiInput}
//               onChange={(e) => setAiInput(e.target.value)}
//               placeholder="Type a song name..."
//             />
//             <div className="ai-buttons">
//               <button
//                 onClick={() => {
//                   setSearchQuery(aiInput);
//                   setShowAIModal(false);
//                 }}
//               >
//                 Search
//               </button>
//               <button onClick={() => setShowAIModal(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}