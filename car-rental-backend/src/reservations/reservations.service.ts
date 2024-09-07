// src/reservations/reservations.service.ts
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';
import { CarsService } from '../cars/cars.service';
import { UsersService } from '../users/users.service';
import { faker } from '@faker-js/faker';
import { Car } from 'src/cars/car.schema';
import { parseISO } from 'date-fns';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(Car.name) private carModel: Model<Car>,
    private carsService: CarsService,
    private usersService: UsersService,
  ) {}

  // Create a new reservation
  async createReservation(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { carId, userId, startDate, endDate, totalPrice } =
      createReservationDto;
    console.log('createReservationDto', createReservationDto);

    // Check if the car is available for the selected dates
    const conflictingReservations = await this.reservationModel.find({
      car: carId,
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (conflictingReservations.length > 0) {
      throw new BadRequestException(
        'Car is not available for the selected dates',
      );
    }

    const newReservation = new this.reservationModel({
      car: carId,
      user: userId,
      startDate,
      endDate,
      totalPrice,
    });

    return newReservation.save();
  }

  async generateRandomReservations(count: number): Promise<Reservation[]> {
    const cars = await this.carsService.getAllCars(); // Get all cars
    const users = await this.usersService.getAllUsers(); // Get all users
    const reservations: ReservationDocument[] = [];

    for (let i = 0; i < count; i++) {
      const car = cars[faker.number.int({ min: 0, max: cars.length - 1 })];
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      const startDate = faker.date.future();
      const endDate = faker.date.soon({ days: 7, refDate: startDate });
      const totalPrice =
        car.pricePerDay *
        Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24));

      const reservation = new this.reservationModel({
        car,
        user,
        startDate,
        endDate,
        totalPrice,
      });
      reservations.push(reservation);
    }

    return this.reservationModel.insertMany(reservations);
  }

  async getReservationsByCarIdAndDates(
    carId: string,
    startDate: string,
    endDate: string,
  ): Promise<Reservation[]> {
    // Get the car
    const car = await this.carsService.getCarById(carId);
    if (!car) {
      return [];
    }

    // Convert dates to ISO Date format
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    console.log('start', start);
    console.log('end', end);
    const CarId = await this.carsService.getId(car);

    // Query to find reservations that overlap with the given date range
    const reservations = await this.reservationModel.find({
      car: CarId, // Ensure you query using car._id
      $or: [
        {
          startDate: { $lte: end }, // Reservation starts before the requested end date
          endDate: { $gte: start }, // Reservation ends after the requested start date
        },
      ],
    });

    console.log('reservations', reservations);
    return reservations;
  }

  // Find all reservations by user ID
  async findReservationsByUser(userId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ user: userId }).populate('car');
  }

  // Delete a reservation by its ID, and ensure it belongs to the user
  async deleteReservation(id: string, userId: string): Promise<any> {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Check if the reservation belongs to the logged-in user
    if (reservation.user.toString() != userId) {
      throw new UnauthorizedException('You cannot delete this reservation');
    }

    // Delete the reservation
    await this.reservationModel.findByIdAndDelete(id);
    return { message: 'Reservation deleted successfully' };
  }
}
