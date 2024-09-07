// src/app/upload/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully", response.data);
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  // Example for Profile page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleFileUpload}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Upload File
      </button>
    </div>
  );
};

export default UploadPage;
