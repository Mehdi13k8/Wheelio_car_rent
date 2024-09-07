// src/reservations/reservations.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from './reservation.schema';
import { CarsModule } from '../cars/cars.module'; // Import CarsModule
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { Car, CarSchema } from 'src/cars/car.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    forwardRef(() => CarsModule),
    UsersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService], // Export ReservationsService so it can be injected
})
export class ReservationsModule {}
