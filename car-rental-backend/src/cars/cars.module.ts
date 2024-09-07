// src/cars/cars.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './car.schema';
import { CarsService } from './cars.service';
import { GenerateCarsCommand } from './commands/generate-cars.command'; // Import the CLI command
import { CarsController } from './cars.controller';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    forwardRef(() => ReservationsModule),
  ],
  providers: [CarsService, GenerateCarsCommand], // Register the command in providers
  exports: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
