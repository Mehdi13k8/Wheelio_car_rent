// src/cars/cars.service.ts
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from './car.schema';
import { faker } from '@faker-js/faker'; // Import faker
import axios from 'axios';
import { ReservationsService } from 'src/reservations/reservations.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @Inject(forwardRef(() => ReservationsService))
    private reservationsService: ReservationsService,
  ) {}

  // Generate random cars and save to the database
  async generateRandomCars(count: number): Promise<Car[]> {
    const cars: CarDocument[] = [];

    return;
    for (let i = 0; i < count; i++) {
      let imgUrl = await axios.get(
        'https://random.imagecdn.app/v1/image?width=500&height=150&category=car',
      );
      let img = await imgUrl.data;
      console.log(img);

      const car = new this.carModel({
        name: faker.vehicle.model(),
        brand: faker.vehicle.manufacturer(),
        pricePerDay: faker.number.int({ min: 20, max: 320 }),
        available: faker.datatype.boolean(),
        image: img,
      });
      cars.push(car);
    }

    // Insert many cars into the database
    return this.carModel.insertMany(cars);
  }

  async isCarAvailable(
    carId: string,
    startDate: string,
    endDate: string,
  ): Promise<boolean> {
    // Assume reservations are stored and can be checked
    const existingReservations = await this.getCarReservations(
      carId,
      startDate,
      endDate,
    );

    console.log(existingReservations.length);
    // If there are no overlapping reservations, the car is available
    return existingReservations.length === 0;
  }

  // Simulate fetching reservations (you would have real reservation logic here)
  private async getCarReservations(
    carId: string,
    startDate: string,
    endDate: string,
  ) {
    // get all reservations for the car
    const reservations =
      await this.reservationsService.getReservationsByCarIdAndDates(
        carId,
        startDate,
        endDate,
      );
    console.log(reservations);

    return reservations;
  }

  //   getAllCars
  async getAllCars(): Promise<Car[]> {
    return this.carModel.find();
  }

  async getCarById(id: string): Promise<Car> {
    // Ensure the id is valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id);
      return null;
    }

    const objectId = new Types.ObjectId(id); // Convert string to ObjectId
    const car = await this.carModel.findById(objectId);

    if (!car) {
      console.log(`Car with id ${id} not found`);
    }

    return car;
  }

  //   get id
  async getId(car): Promise<Types.ObjectId> {
    return car._id;
  }
}
