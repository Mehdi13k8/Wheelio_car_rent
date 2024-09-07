"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Ensure correct import for params
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservationPage() {
  const router = useRouter();
  const { id } = useParams(); // Capture the dynamic segment from URL (car ID)
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  // Fetch car details from the backend based on the car ID
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/cars/${id}` // Replace with your backend API
        );
        setCar(response.data);
      } catch (err) {
        console.error("Error fetching car data:", err);
      }
    };

    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    fetchCar();
  }, [id]);

  // Calculate the total price based on the selected dates
  useEffect(() => {
    if (startDate && endDate && car) {
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      setTotalPrice(days * car.pricePerDay);
    }
  }, [startDate, endDate, car]);

  // Check car availability for the selected dates
  const checkAvailability = async () => {
    if (!startDate || !endDate) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/cars/availability?carId=${id}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      setIsAvailable(response.data);
      setAvailabilityChecked(true);
    } catch (err) {
      console.error("Error checking car availability:", err);
      setIsAvailable(false); // Default to not available on error
    }
  };

  // Handle reservation submission
  const handleReservation = async () => {
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner une période de réservation valide.");
      return;
    }

    try {
      // get user from token
      const token = localStorage.getItem("token");
      // find from jwt payload the userId
      const myUserResponse = await axios.get("http://localhost:3001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = myUserResponse.data._id;

      const response = await axios.post("http://localhost:3001/reservations", {
        carId: car._id,
        userId: userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
      });
      console.log("response ==>", response);

      if (response.status === 201) {
        setReservationSuccess(true);
        setTimeout(() => {
          router.push("/"); // Redirect to home after successful reservation
        }, 2000);
      }
    } catch (err) {
      console.error("Error making reservation:", err);
      alert("Échec de la réservation. Veuillez réessayer.");
    }
  };

  // Check availability when dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  if (!car) {
    return <div>Chargement des données de la voiture...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Réservez {car.name} - {car.brand}
      </h2>

      <img
        src={car.image}
        alt={car.name}
        className="w-full h-64 object-cover mb-6"
      />

      <p className="mb-4">
        <strong>Prix par jour: </strong> {car.pricePerDay}€
      </p>

      <div className="mb-4">
        <label className="block font-medium">Date de début:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="border rounded px-3 py-2"
          placeholderText="Sélectionnez la date de début"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Date de fin:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          className="border rounded px-3 py-2"
          placeholderText="Sélectionnez la date de fin"
        />
      </div>

      {totalPrice !== null && (
        <p className="mb-4">
          <strong>Prix total: </strong> {totalPrice}€
        </p>
      )}

      {/* Show availability status */}
      {availabilityChecked && (
        <p
          className={`mb-4 ${isAvailable ? "text-green-500" : "text-red-500"}`}
        >
          {isAvailable
            ? "Cette voiture est disponible pour ces dates."
            : "Cette voiture n'est pas disponible pour ces dates."}
        </p>
      )}

      {!isLoggedIn ? (
        <p className="text-red-500">
          Veuillez vous connecter pour effectuer une réservation.
        </p>
      ) : (
        <button
          onClick={handleReservation}
          disabled={!isAvailable} // Disable if the car is not available
          className={`w-full py-2 rounded ${
            isAvailable
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-500 text-white cursor-not-allowed"
          }`}
        >
          Réserver maintenant
        </button>
      )}

      {reservationSuccess && (
        <p className="mt-4 text-green-500">Réservation réussie !</p>
      )}
    </div>
  );
}
