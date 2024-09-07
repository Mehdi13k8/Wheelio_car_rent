// src/context/LoginContext.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const LoginContext = createContext<any>(null);

// Create a provider component to wrap the app
export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set logged-in state if token exists
  }, [router]);

  const login = () => {
    setIsLoggedIn(true);
    console.log("Login state:", isLoggedIn);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to use the LoginContext
export const useLogin = () => useContext(LoginContext);
