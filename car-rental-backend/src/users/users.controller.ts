// src/users/users.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Res,
  StreamableFile,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

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

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory where files are stored
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.originalname}-${uniqueSuffix}${path.extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only PDF and JPEG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const user = req.user; // Get the logged-in user from the JWT token
    const userId = user._id; // Or however your user ID is structured

    // Save file information in the database or link it to the user
    const savedFile = await this.usersService.saveUploadedFile(userId, file);

    return {
      message: 'File uploaded successfully',
      file: savedFile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('uploaded-files')
  async getVerifiedUploadedFiles(@Request() req: any) {
    const userId = req.user._id; // Get the logged-in user's ID

    // Retrieve the uploaded files for the user from the service
    const uploadedFiles = await this.usersService.getUploadedFiles(userId);

    const verifiedFiles = [];

    // Loop through the user's uploaded files and check if they exist in the uploads folder
    for (const file of uploadedFiles) {
      try {
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads',
          file.filename,
        );
        if (fs.existsSync(filePath)) {
          verifiedFiles.push({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
          });
        } else {
          console.log(
            `File ${file.filename} is missing from the uploads folder.`,
          );
        }
      } catch (error) {
        console.error('Error while joining paths:', error);
      }
      // Check if the file exists in the uploads folder
    }

    // Return the list of verified files from both the database and the file system
    return {
      message: 'Verified uploaded files',
      files: verifiedFiles,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response, // Utiliser le type Response d'express
  ): Promise<StreamableFile> {
    const userId = req.user._id;

    // Fetch the user and check if they uploaded the file
    const user = await this.usersService.findById(userId);
    const uploadedFile = user.uploadedFiles.find(
      (file) => file.filename === filename,
    );

    if (!uploadedFile) {
      throw new UnauthorizedException('You do not have access to this file');
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

    const file = fs.createReadStream(filePath);

    res.set({
      'Content-Type': uploadedFile.mimetype,
      'Content-Disposition': `attachment; filename="${uploadedFile.filename}"`,
    });

    return new StreamableFile(file);
  }
}
