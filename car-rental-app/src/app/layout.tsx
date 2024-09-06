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
      <body className="bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Car Rental</h1>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          © 2024 - Car Rental App
        </footer>
      </body>
    </html>
  );
}
