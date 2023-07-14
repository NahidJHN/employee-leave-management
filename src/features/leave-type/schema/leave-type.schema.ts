import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ActiveInaStatus, collectionsName } from 'src/features/constant';

@Schema({ timestamps: true, versionKey: false })
export class LeaveType extends Document {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: collectionsName.admin,
        required: true,
    })
    admin: Types.ObjectId;

    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop()
    note: string;

    @Prop({
        Type: String,
        enum: ActiveInaStatus,
        default: ActiveInaStatus.ACTIVE,
        required: true,
    })
    status: string;
}

export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);
