import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(name: string): Promise<User | undefined> {
    return this.userModel.findOne({ name });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  // Register a new user
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }

  //   getAllUsers
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async generateRandomUsers(count: number): Promise<User[]> {
    const users: UserDocument[] = [];

    for (let i = 0; i < count; i++) {
      const user = new this.userModel({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(), // For simplicity, not hashed in this example
      });
      users.push(user);
    }

    return this.userModel.insertMany(users);
  }
}
