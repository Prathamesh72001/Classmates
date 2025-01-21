// src/firebaseUtils.js
import { storage } from "./firebase"; // Import your initialized Firebase app
import { ref, getDownloadURL } from "firebase/storage";

// Function to get file URL from Firebase Storage based on file name
export const getFileUrl = async (path,fileName) => {
    try {
        const fileRef = ref(storage, `${path}/${fileName}`); // Reference to file in storage
        const url = await getDownloadURL(fileRef); // Fetch URL
        console.log("File URL:", url);
        return url;
      } catch (error) {
        console.error("Error fetching file URL:", error);
        return null;
      }
  };
