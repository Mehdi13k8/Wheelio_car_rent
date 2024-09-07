import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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

  // Save file information in the user's profile
  async saveUploadedFile(userId: string, file: Express.Multer.File) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Add file information to the user profile
    user.uploadedFiles = user.uploadedFiles || [];
    user.uploadedFiles.push({
      filename: file.filename,
      path: file.path, // Path where the file is saved by Multer
      mimetype: file.mimetype,
      size: file.size,
    });

    return user.save();
  }

  // Add a method to retrieve the user's uploaded files
  async getUploadedFiles(userId: string) {
    const user = await this.userModel.findById(userId).select('uploadedFiles');
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.uploadedFiles;
  }

  // Remove file from user's uploaded files list
  async removeUploadedFile(userId: string, filename: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove the file from the user's uploaded files array
    user.uploadedFiles = user.uploadedFiles.filter(
      (file) => file.filename !== filename,
    );

    // Save the updated user document
    await user.save();
  }
}
