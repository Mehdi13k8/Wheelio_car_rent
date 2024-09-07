// src/cars/car.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  pricePerDay: number;

  @Prop({ default: true })
  available: boolean;

  @Prop({ required: true })
  image: string;
  private _id: any;
}

export const CarSchema = SchemaFactory.createForClass(Car);
