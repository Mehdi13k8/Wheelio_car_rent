// src/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // get email from user mongo
    user = user._doc;
    const payload = {
      email: user.email,
      sub: user._id,
      isAdmin: user.isAdmin,
      userName: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Get logged-in user based on the token
  async getLoggedUser(req: any) {
    // Extract token and decode it to retrieve the user
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.usersService.findById(decodedToken.sub);
    return user;
  }
}
