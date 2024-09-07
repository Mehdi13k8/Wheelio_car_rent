"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileIcon, setUploadFileIcon] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
          headers: { Authorization: `Bearer ${token}` },
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

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3001/reservations/my-reservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReservations(response.data);
      } catch (err) {
        console.error("Error fetching reservations", err);
      }
    };

    fetchReservations();
  }, []);

  // Fetch uploaded files from the backend
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3001/users/uploaded-files",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setUploadedFiles(response.data.files);
        }
      } catch (err) {
        console.error("Error fetching uploaded files", err);
        setError("Failed to fetch uploaded files.");
      }
    };

    fetchUploadedFiles();
  }, [uploadFileIcon]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "image/jpeg")
    ) {
      setUploadFile(file);
      setUploadFileIcon(
        file.type === "application/pdf" ? "/pdf-icon.svg" : "/jpeg-icon.svg"
      );
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
        let file = response.data.file;
        if (uploadFileIcon == "/pdf-icon.svg") {
          file.mimetype = "application/pdf";
        } else {
          file.mimetype = "image/jpeg";
        }
        console.log(response.data.file.uploadedFiles);
        // file.filename = response.data.file.filename;
        setUploadedFiles((prev) => [...prev, response.data.file.uploadedFiles]);

        setUploadFileIcon(null);
        setUploadFile(null);
      } else {
        setUploadMessage("Failed to upload the file.");
      }
    } catch (err) {
      setUploadMessage("An error occurred during the upload.");
    }
  };

  // Handle file download
  const handleDownloadFile = async (filename) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3001/users/download/${filename}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Failed to download file.");
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (filename) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3001/users/uploaded-files/${filename}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setUploadedFiles((prev) =>
          prev.filter((file) => file.filename !== filename)
        );
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Failed to delete file.");
    }
  };

  // Handle reservation deletion
  const handleDeleteReservation = async (reservationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3001/reservations/${reservationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setReservations((prev) =>
          prev.filter((res) => res._id !== reservationId)
        );
      }
    } catch (error) {
      setError("Failed to delete reservation.");
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

      <h3 className="text-2xl font-bold mt-8 mb-4">Reservations</h3>
      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((res) => (
            <div key={res._id} className="border p-4 rounded-lg bg-gray-100">
              <p>
                <strong>Car:</strong> {res.car.name} - {res.car.brand}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {new Date(res.startDate).toLocaleDateString()} to{" "}
                {new Date(res.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Price:</strong> {res.totalPrice}€
              </p>
              <button
                onClick={() => handleDeleteReservation(res._id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Delete Reservation
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No reservations found.</p>
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
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleDownloadFile(file.filename)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDeleteFile(file.filename)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
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
    </div>
  );
}
