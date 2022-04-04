import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './role.schema';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Expose({ groups: ['administrator'] })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  @Type(() => Role)
  role: Role;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
