import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Person } from "src/features/common";

@Schema()
export class Admin extends Person { }


export const AdminSchema = SchemaFactory.createForClass(Admin)