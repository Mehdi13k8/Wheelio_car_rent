"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // If you're using axios for the login request

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // if token is in local storage, redirect to home page
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });

      // Assuming successful login, store token and redirect
      const { access_token } = response.data;
      localStorage.setItem('token', access_token); // Store JWT in local storage
      router.push('/'); // Redirect to homepage or another protected page
      router.refresh();
      window.location.reload();
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Se connecter</h2>

        <form onSubmit={handleLogin}>
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Connexion
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Pas de compte?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-blue-500 hover:underline"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
}
