// src/app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadFile, setUploadFile] = useState(null); // State for selected file
  const [uploadMessage, setUploadMessage] = useState(""); // Message for upload feedback
  const router = useRouter();

  // Verify token and fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
          setLoading(false);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (err) {
        console.error("Token verification failed", err);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    verifyToken();
  }, [router, loading]);

  // Handle reservation deletion
  const handleDeleteReservation = async (reservationId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:3001/reservations/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted reservation from the list
        setReservations((prev) => prev.filter((res) => res._id !== reservationId));
      }
    } catch (err) {
      console.error("Error deleting reservation", err);
      setError("Failed to delete reservation. Please try again.");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "image/jpeg")) {
      setUploadFile(file);
      setUploadMessage("");
    } else {
      setUploadMessage("Only PDF and JPEG files are allowed.");
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadMessage("Please select a valid PDF or JPEG file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:3001/users/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setUploadMessage("File uploaded successfully.");
      } else {
        console.log(response);
        setUploadMessage("Failed to upload the file.");
      }
    } catch (err) {
      console.error("Error uploading file", err.response);
      setUploadMessage("An error occurred during the upload. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
          </p>
        </div>
      )}


      <h3 className="text-xl font-bold mt-8 mb-4">Upload File</h3>
      <input
        type="file"
        accept=".pdf, .jpeg"
        onChange={handleFileChange}
        className="block mb-4"
      />
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Upload File
      </button>

      {uploadMessage && <p className="mt-4 text-red-500">{uploadMessage}</p>}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}
