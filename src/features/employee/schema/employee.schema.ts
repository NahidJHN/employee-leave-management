import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Person } from 'src/features/common';


@Schema({ timestamps: true, versionKey: false })
export class Employee extends Person {
    @Prop({ type: mongoose.Schema.ObjectId, required: true })
    admin: Types.ObjectId

    @Prop({ type: Number, required: true, default: 45 })
    availableLeaves: number
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
