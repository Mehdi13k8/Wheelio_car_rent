// src/cars/cars.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  // Get all cars
  @Get()
  // @UseGuards(JwtAuthGuard) // Protect this route
  async getCars() {
    return this.carsService.getAllCars();
  }

  @Get('availability')
  async checkAvailability(
    @Query('carId') carId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.carsService.isCarAvailable(carId, startDate, endDate);
  }

  // Get a single car by its ID
  @Get(':carId')
  async getCar(@Param('carId') carId: string) {
    return this.carsService.getCarById(carId);
  }

  @Post('generate')
  async generateCars(@Body('count') count: number) {
    return this.carsService.generateRandomCars(count);
  }
}
