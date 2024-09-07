import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CarsService } from './cars/cars.service';
import { UsersService } from './users/users.service';
import { ReservationsService } from './reservations/reservations.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const dev = configService.get('ENV');

  // Enable cors for request from React
  app.enableCors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow credentials (e.g., cookies)
  });

  if (dev) {
    console.log('Running in development mode. Generating random data...');

    // Generate random cars, users, and reservations
    const carsService = app.get(CarsService);
    const usersService = app.get(UsersService);
    const reservationsService = app.get(ReservationsService);

    await carsService.generateRandomCars(10); // Generate 10 random cars
    console.log('Random cars generated.');

    await usersService.generateRandomUsers(5); // Generate 5 random users
    console.log('Random users generated.');

    await reservationsService.generateRandomReservations(7); // Generate 7 random reservations
    console.log('Random reservations generated.');
  }
  await app.listen(PORT);
  // await app.listen(3000);
}
bootstrap();
