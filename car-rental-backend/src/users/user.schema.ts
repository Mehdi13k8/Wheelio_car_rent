import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({
    type: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    default: [],
  })
  uploadedFiles: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
