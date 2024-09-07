// src/reservations/dto/create-reservation.dto.ts
import { IsNotEmpty, IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
