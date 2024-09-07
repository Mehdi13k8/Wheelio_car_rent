"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios"; // Axios for API calls. You can use fetch instead if you prefer.

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password length error
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Frontend validation
    if (!validateEmail(email)) {
      setError("Adresse e-mail non valide");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/register", {
        name,
        email,
        password,
      });

      // Handle successful registration (redirect or display success message)
      setSuccess(
        "Inscription réussie ! Redirection vers la page de connexion..."
      );
      setTimeout(() => {
        router.push("/login"); // Redirect to login after a short delay
      }, 2000);
    } catch (err) {
      // Check if it's a server-side error with a response
      if (err instanceof AxiosError) {
        // This is the error message sent from your NestJS backend
        const { message } = err?.response?.data;

        // Set the error message in the state to display it to the user
        setError(message);
      } else {
        // Handle errors that don't come from the server (network issues, etc.)
        setError("Échec de l'inscription. Veuillez réessayer.");
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check password length
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit comporter au moins 6 caractères");
    } else {
      setPasswordError(""); // Clear the error if the password is valid
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

        {/* Form */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {/* Show password error below the input field */}
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          {/* Error or success messages */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Déjà un compte ?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
