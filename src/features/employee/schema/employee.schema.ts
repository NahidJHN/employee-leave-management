import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from 'src/features/common';


@Schema()
export class Employee extends Person { }

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
