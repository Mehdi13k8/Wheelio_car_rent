// src/cars/commands/generate-cars.command.ts
import { Injectable, Logger } from '@nestjs/common';
import { Console, Command } from 'nestjs-console';
import { CarsService } from '../cars.service';

@Console({
  command: 'generate:cars',
  description: 'Generate random cars',
})
@Injectable()
export class GenerateCarsCommand {
  constructor(private readonly carsService: CarsService) {}

  @Command({
    command: 'generate:cars <count>',
    description: 'Generate a number of random cars',
  })
  async generateCars(count: number): Promise<void> {
    console.log(`Generating ${count} cars...`);
    await this.carsService.generateRandomCars(count);

    console.log(`${count} cars generated successfully.`);
  }
}
