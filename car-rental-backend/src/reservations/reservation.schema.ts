import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Types for ObjectId
import { User } from 'src/users/user.schema';
import { Car } from 'src/cars/car.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Car' }) // Use ObjectId for referencing Car
  car: Types.ObjectId; // This should store the car's ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) // Use ObjectId for referencing User
  user: Types.ObjectId; // This should store the user's ObjectId

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  totalPrice: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
