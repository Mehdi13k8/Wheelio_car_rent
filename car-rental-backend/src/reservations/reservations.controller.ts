import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Reservation } from './reservation.schema';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Post()
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      return await this.reservationService.createReservation(
        createReservationDto,
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(JwtAuthGuard) // Protect this route with JWT Auth
  @Get('my-reservations')
  async getMyReservations(@Request() req: any) {
    const userId = req.user._id; // Get user ID from the JWT token
    return this.reservationService.findReservationsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // Delete route to delete a reservation by ID
  async deleteReservation(@Param('id') id: string, @Request() req: any) {
    const userId = req.user._id; // Get user ID from the JWT token
    return this.reservationService.deleteReservation(id, userId);
  }
}
