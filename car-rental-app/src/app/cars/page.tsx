// src/app/cars/page.tsx
import React from 'react';

const cars = [
  { id: 1, name: 'Toyota Yaris', price: '50€/jour' },
  { id: 2, name: 'BMW Série 3', price: '120€/jour' },
  { id: 3, name: 'Mercedes-Benz A-Class', price: '100€/jour' },
];

export default function CarList() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Nos Voitures</h1>
      <ul className="space-y-4 mt-6">
        {cars.map((car) => (
          <li key={car.id} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">{car.name}</h2>
            <p className="text-gray-700">Prix : {car.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
