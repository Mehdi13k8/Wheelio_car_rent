"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation in the App Router

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in

  // Check if token exists on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Set logged in state if token exists
    }
  }, []);

  // Function to handle login button click
  const handleLogin = () => {
    router.push('/login'); // Navigate to the login page
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update state
  };

  if (isLoggedIn) {
    // Redirect or show a message when the user is logged in
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Bienvenue de retour !</h2>
        <p className="mt-4 text-gray-600">
          Vous êtes connecté. Explorez nos véhicules ou gérez votre compte.
        </p>

        <button
          onClick={() => router.push('/dashboard')} // Navigate to a protected dashboard
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          Accéder à mon compte
        </button>

        <button
          onClick={handleLogout} // Call the handleLogout function on button click
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  // Show login and register buttons if the user is not logged in
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold">Bienvenue sur notre plateforme de location de voitures</h2>
      <p className="mt-4 text-gray-600">
        Parcourez notre sélection de voitures de location pour vos besoins personnels et professionnels.
      </p>

      <div className="mt-6">
        <button
          onClick={handleLogin} // Call the handleLogin function on button click
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          Se connecter
        </button>
        <button
          onClick={() => router.push('/register')} // Navigate to the registration page
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
