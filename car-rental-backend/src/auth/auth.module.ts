// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'mehdiDevTest', // Same key
      signOptions: { expiresIn: '60m' }, // Pas important pour le moment
    }),
  ],
  controllers: [AuthController], // Add AuthController
  providers: [AuthService, JwtStrategy], // Include JwtStrategy
  exports: [AuthService],
})
export class AuthModule {}
