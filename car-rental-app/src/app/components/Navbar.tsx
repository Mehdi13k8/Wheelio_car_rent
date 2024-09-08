"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../../context/LoginContext";

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useLogin(); // Get the login state and logout function

  const handleLogout = () => {
    logout(); // Call logout from context
    router.push("/login"); // Redirect to login page after logout
  };

  useEffect(() => {
    console.log("Navbar login state:", isLoggedIn);
  }, [isLoggedIn]); // Log whenever login state changes

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {isLoggedIn && (
            <>
              <button
                onClick={() => router.push("/")}
                className="hover:bg-gray-700 px-3 py-2 rounded"
              >
                Home
              </button>
            </>
          )}
          <button
            onClick={() => router.push("/profile")}
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Profile
          </button>
          {/* <button
            onClick={() => router.push("/upload")}
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Upload File
          </button> */}
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
