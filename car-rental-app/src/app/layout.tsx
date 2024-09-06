// src/app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Car Rental App',
  description: 'Une plateforme de location de voitures',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow w-full">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Car Rental</h1>
          </div>
        </header>
>
        <main className="flex-grow max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        {children}</main>
        <footer className="bg-gray-800 text-white py-4 text-center w-full mt-auto">
          © 2024 - Car Rental App
        </footer>
      </body>
    </html>
  );
}
