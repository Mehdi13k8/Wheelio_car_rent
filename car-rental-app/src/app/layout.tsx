"use client";

import "./globals.css";
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { LoginProvider } from "../context/LoginContext"; // Import the LoginProvider
import axios from "axios";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:3001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
      } else {
        localStorage.removeItem("token");
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Token verification failed", err);
      localStorage.removeItem("token");
      router.push("/login");
      router.refresh();
    }
  };

  useEffect(() => {
    verifyToken();
  }, [router]);

  // test each 30s
  useEffect(() => {
    const interval = setInterval(() => {
      // if token is declared
      if (localStorage.getItem("token")) verifyToken();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <html lang="fr">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Head>
          <title>Car Rental App - Home</title>
          <meta
            name="description"
            content="Welcome to the Car Rental App homepage"
          />
        </Head>
        <LoginProvider>
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </LoginProvider>
        <footer className="bg-gray-800 text-white py-4 text-center w-full mt-auto">
          © 2024 - Car Rental App
        </footer>
      </body>
    </html>
  );
}
