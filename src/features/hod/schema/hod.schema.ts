import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Person } from 'src/features/common';
import { collectionsName } from 'src/features/constant';

@Schema({ timestamps: true, versionKey: false })
export class Hod extends Person {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: collectionsName.admin })
  admin: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 45 })
  availableLeaves: number;
}

export const HodSchema = SchemaFactory.createForClass(Hod);
export type HodDocument = Hod & Document;
