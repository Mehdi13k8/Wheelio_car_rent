import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // getHello(): string {
  //   return 'Hello World!';
  // }

  mainPage(): string {
    return 'Welcome to the Car Rental API';
  }
}
