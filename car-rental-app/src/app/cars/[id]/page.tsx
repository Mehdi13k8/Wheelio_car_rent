'use client';
// src/app/cars/[id]/page.tsx
import React from 'react';
import { useParams } from 'next/navigation';

export default function CarDetails() {
  const params = useParams();
  const id = params.id;

  // Simuler la récupération des détails d'une voiture (cela devrait être fait via une API)
  const car = { id, name: 'Toyota Yaris', price: '50€/jour', description: 'Une petite voiture économique.' };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Détails de la voiture</h1>
      <h2 className="text-2xl font-bold mt-4">{car.name}</h2>
      <p className="text-gray-700 mt-2">{car.description}</p>
      <p className="text-gray-700 mt-2">Prix : {car.price}</p>
    </div>
  );
}
