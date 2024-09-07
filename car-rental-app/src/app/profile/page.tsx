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
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
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
  }, [router]);

  // Fetch uploaded files from the backend
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3001/users/uploaded-files",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setUploadedFiles(response.data.files);
        }
      } catch (err) {
        console.error("Error fetching uploaded files", err);
        setError("Failed to fetch uploaded files. Please try again.");
      }
    };

    fetchUploadedFiles();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "image/jpeg")
    ) {
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

      const response = await axios.post(
        "http://localhost:3001/users/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setUploadMessage("File uploaded successfully.");
        setUploadedFiles((prev) => [...prev, response.data.file]); // Add the uploaded file to the list
      } else {
        console.log(response);
        setUploadMessage("Failed to upload the file.");
      }
    } catch (err) {
      console.error("Error uploading file", err.response);
      setUploadMessage(
        "An error occurred during the upload. Please try again."
      );
    }
  };

  const handleDownloadFile = async (filename) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3001/users/download/${filename}`,
        {
          responseType: "blob", // Important for streaming binary data
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create a link element and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Set file name
      document.body.appendChild(link);
      link.click();

      // Cleanup the link after download
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Failed to download file.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Profile Information
      </h2>

      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-lg">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-lg">
            <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
          </p>
        </div>
      )}

      <h3 className="text-2xl font-bold mt-8 mb-4">Uploaded Files</h3>

      {uploadedFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedFiles.map((file) => (
            <div
              key={file.filename}
              className="border p-4 rounded-lg flex flex-col items-center justify-center bg-gray-100"
            >
              {file.mimetype === "application/pdf" ? (
                <img
                  // svg icon from public folder
                  src="/pdf-icon.svg"
                  alt="PDF Icon"
                  className="w-12 h-12 mb-2"
                />
              ) : (
                <img
                  src="/jpeg-icon.svg"
                  alt="JPEG Icon"
                  className="w-12 h-12 mb-2"
                />
              )}
              <p className="text-sm text-center break-words">{file.filename}</p>
              <button
                onClick={() => {
                  handleDownloadFile(file.filename);
                }}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}

      <h3 className="text-2xl font-bold mt-8 mb-4">Upload File</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
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
      </div>

      {/* <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Log Out
      </button> */}
    </div>
  );
}
