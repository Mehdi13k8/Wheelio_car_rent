// src/users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const registering = await this.usersService.register(createUserDto);
    return registering;
  }

  @UseGuards(JwtAuthGuard) // Protect this route
  @Get('profile')
  getProfile() {
    // Code to fetch and return the user's profile
    return { message: 'This is a protected route' };
  }
}
