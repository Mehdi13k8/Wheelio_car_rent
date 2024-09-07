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

  // Fetch reservations for the logged-in user
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You need to log in to view your reservations.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/reservations/my-reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reservations", err);
        setError("Failed to fetch reservations. Please try again.");
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

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

      <h3 className="text-xl font-bold mt-8 mb-4">My Reservations</h3>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation._id} className="mb-4 border p-4 rounded">
              <strong>Car:</strong> {reservation.car.name} - {reservation.car.brand}
              <br />
              <strong>Dates:</strong> {new Date(reservation.startDate).toLocaleDateString()} to{" "}
              {new Date(reservation.endDate).toLocaleDateString()}
              <br />
              <strong>Total Price:</strong> {reservation.totalPrice}€
              <br />
              <button
                onClick={() => handleDeleteReservation(reservation._id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Delete Reservation
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found.</p>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
          router.refresh();
          window.location.reload();
        }}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}
