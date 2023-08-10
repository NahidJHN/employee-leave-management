import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { collectionsName } from 'src/features/constant';


@Schema({ timestamps: true, versionKey: false })
export class Department extends Document {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionsName.admin,
        required: true,
    })
    admin: Types.ObjectId;


    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, })
    alias: string;

    @Prop({ type: String, })
    description: string;

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
