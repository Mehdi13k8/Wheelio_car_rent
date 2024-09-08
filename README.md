
# Wheelio_car_rent

Application to rent cars for a car rental company

## 🚗 Car Rental Platform

This is a Car Rental web application built using NestJS for the backend and ReactJS for the frontend. It allows users to browse available cars, make reservations, upload files, and manage their profile.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
  - [User Routes](#user-routes)
  - [File Upload](#file-upload)
  - [Reservations](#reservations)
  - [Cars](#cars)
- [Common Tasks](#common-tasks)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- User Authentication (JWT-based)
- Car Listings: Users can view available cars and filter them by date, brand, price, and availability.
- Reservations: Users can reserve available cars within a selected date range.
- Profile Management: Users can manage their profile information and view their past reservations.
- File Upload: Users can upload and manage files (PDF and JPEG).
- Admin Features: Admin users have additional features, such as user and car management.

## Technologies

- **Backend**: NestJS, MongoDB, Passport (JWT Auth), Mongoose
- **Frontend**: ReactJS, Next.js, Tailwind CSS
- **Database**: MongoDB (with Mongoose for schema management)
- **File Storage**: Local storage for file uploads (PDF and JPEG)

## Getting Started

### Backend Setup

1. **Install Dependencies**:

   ```bash
   cd car-rental-backend
   npm install
   ```

2. **Environment Variables**: Create a `.env` file in the `car-rental-backend` folder and add the following variables:

   ```bash
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myDatabase
   JWT_SECRET=your_jwt_secret(Not necessary)
   ```

3. **Start the Backend**:

   ```bash
   npm run start
   ```

   The backend will run at `http://localhost:3001`.

### Frontend Setup

1. **Install Dependencies**:

   ```bash
   cd car-rental-frontend
   npm install
   ```

2. **Environment Variables**: Add the following variables to your `.env.local` file inside the `car-rental-frontend` folder:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start the Frontend**:

   ```bash
   npm run dev
   ```

   The frontend will run at `http://localhost:3000`.

## API Documentation

### User Routes

- **Register**:

  - `POST /users/register`
  - Body: `{ name: string, email: string, password: string }`

- **Login**:

  - `POST /auth/login`
  - Body: `{ email: string, password: string }`
  - Response: `{ access_token: string }`

- **Get User Profile**:

  - `GET /users/profile`
  - Auth: Bearer token

### File Upload

- **Upload File**:

  - `POST /users/upload`
  - Auth: Bearer token
  - Request: FormData (supports PDF and JPEG)

- **Delete File**:

  - `DELETE /users/uploaded-files/:filename`
  - Auth: Bearer token

- **Download File**:

  - `GET /users/download/:filename`
  - Auth: Bearer token

### Reservations

- **Create Reservation**:

  - `POST /reservations`
  - Body: `{ carId: string, startDate: string, endDate: string, totalPrice: number }`
  - Auth: Bearer token

- **Get User Reservations**:

  - `GET /reservations/my-reservations`
  - Auth: Bearer token

- **Delete Reservation**:

  - `DELETE /reservations/:id`
  - Auth: Bearer token

### Cars

- **List Cars**:

  - `GET /cars`

- **Check Car Availability**:

  - `GET /cars/availability?carId=123&startDate=2024-09-01&endDate=2024-09-10`

## Common Tasks

### Running Backend Locally

```bash
cd car-rental-backend
npm run start
```

### Running Frontend Locally

```bash
cd car-rental-frontend
npm run dev
```

### File Upload

- Go to the **Profile** page.
- Upload a file (only PDF or JPEG allowed).
- You can view or delete files after uploading them.

### Creating a Reservation

- Go to the **Home** page.
- Select a car and choose the date range.
- If the car is available, reserve it.

### Viewing and Deleting Reservations

- Go to the **Profile** page.
- View all your reservations and delete them if needed.

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m 'Add my feature'`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Author

This project is developed by Mehdi.
