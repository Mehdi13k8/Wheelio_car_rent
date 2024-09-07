"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // For making API requests
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker"; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Date picker styles
import { useLogin } from "../context/LoginContext"; // Import the login context

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    priceMin: "",
    priceMax: "",
    available: true,
    startDate: null as string | null,
    endDate: null as string | null,
  });
  const [filteredCars, setFilteredCars] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const { isLoggedIn } = useLogin(); // Get the login state

  // Live counter for the current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch car data from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:3001/cars"); // Replace with your backend URL
        setCars(response.data);
        setFilteredCars(response.data); // Initially, all cars are shown
      } catch (err) {
        console.error("Failed to fetch cars:", err.response);
      }
    };

    fetchCars();
  }, []);

  // Handle filters and apply them to the car list
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters whenever filters change
  useEffect(() => {
    const applyFilters = async () => {
      let filtered = cars;

      // Apply brand, price, and availability filters
      if (filters.brand) {
        filtered = filtered.filter((car) =>
          car.brand.toLowerCase().includes(filters.brand.toLowerCase())
        );
      }

      if (filters.priceMin) {
        filtered = filtered.filter(
          (car) => car.pricePerDay >= parseInt(filters.priceMin)
        );
      }

      if (filters.priceMax) {
        filtered = filtered.filter(
          (car) => car.pricePerDay <= parseInt(filters.priceMax)
        );
      }

      // Handle date availability filtering asynchronously
      if (filters.startDate && filters.endDate) {
        const availableCars = await Promise.all(
          filtered.map(async (car) => {
            const isAvailable = await checkCarAvailability(
              car,
              filters.startDate,
              filters.endDate
            );
            return { ...car, isAvailable };
          })
        );

        // Filter out cars that are not available
        filtered = availableCars;
      }

      setFilteredCars(filtered);
    };

    applyFilters();
  }, [filters, cars]);

  // Function to check car availability asynchronously
  const checkCarAvailability = async (car, startDate, endDate) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/cars/availability?carId=${car._id}&startDate=${startDate}&endDate=${endDate}`
      );
      return response.data; // Assuming response.data is a boolean indicating availability
    } catch (error) {
      console.error("Failed to check car availability:", error);
      return false; // Default to not available on error
    }
  };

  // Handle login/logout logic
  const handleLogin = () => {
    router.push("/login");
    router.refresh();
    console.log("Login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // If logged in, show reservation functionality
  const handleReservation = (carId) => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push(`/reserve/${carId}`);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          Welcome to the Car Rental Platform
        </h2>
        <p>
          Explore our range of cars available for rental. Navigate using the
          navbar above to access your profile, upload files
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Live counter */}
        <div className="mb-6">
          <h3 className="text-xl font-bold">
            Heure actuelle: {currentTime.toLocaleTimeString()}
          </h3>
        </div>

        <h2 className="text-2xl font-bold mb-6">
          Parcourez notre sélection de voitures
        </h2>

        {/* Filters */}
        <div className="filters grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block font-medium">Marque:</label>
            <input
              type="text"
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Prix Min:</label>
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Prix Max:</label>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block font-medium">Disponibilité:</label>
            <input
              type="checkbox"
              name="available"
              checked={filters.available}
              onChange={() =>
                setFilters((prev) => ({ ...prev, available: !prev.available }))
              }
              className="mt-2"
            />
          </div>

          {/* Date Range Filter */}
          <div className="col-span-2">
            <label className="block font-medium">Période de réservation:</label>
            <div className="flex space-x-4">
              <DatePicker
                selected={
                  filters.startDate ? new Date(filters.startDate) : undefined
                } // Change null to undefined
                onChange={(date) =>
                  setFilters({
                    ...filters,
                    startDate: date ? date.toISOString() : null,
                  })
                }
                selectsStart
                startDate={
                  filters.startDate ? new Date(filters.startDate) : undefined
                } // Change null to undefined
                endDate={
                  filters.endDate ? new Date(filters.endDate) : undefined
                } // Change null to undefined
                className="border rounded px-3 py-2"
                placeholderText="Date de début"
              />
              <DatePicker
                selected={
                  filters.endDate ? new Date(filters.endDate) : undefined
                } // Change null to undefined
                onChange={(date) =>
                  setFilters({
                    ...filters,
                    endDate: date ? date.toISOString() : null,
                  })
                }
                selectsEnd
                startDate={
                  filters.startDate ? new Date(filters.startDate) : undefined
                } // Change null to undefined
                endDate={
                  filters.endDate ? new Date(filters.endDate) : undefined
                } // Change null to undefined
                className="border rounded px-3 py-2"
                placeholderText="Date de fin"
              />
            </div>
          </div>
        </div>

        {/* Car list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className={`car-card border rounded-lg p-4 ${
                car.isAvailable === false ? "opacity-50" : ""
              }`} // Add blur effect if not available
            >
              <h3 className="text-xl font-bold">
                {car.name} - {car.brand}
              </h3>
              <p className="mt-2">Prix: {car.pricePerDay}€/jour</p>
              <p className="mt-2">
                {car.isAvailable ? "Disponible" : "Indisponible"}
              </p>
              <img
                src={car.image}
                alt={car.name}
                className="mt-4 w-full h-40 object-cover"
              />
              <button
                onClick={() => handleReservation(car._id)}
                disabled={!car.isAvailable} // Disable button if not available
                className={`mt-4 w-full py-2 rounded ${
                  car.isAvailable
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                Réserver
              </button>
            </div>
          ))}
        </div>

        {/* Login/Logout Buttons */}
        {!isLoggedIn ? (
        <div>
          <p>Please log in to access more features.</p>
          <button onClick={() => router.push("/login")} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Login
          </button>
        </div>
      ) : (
        <p>You are logged in! Enjoy browsing our cars.</p>
      )}
      </div>
    </>
  );
}
