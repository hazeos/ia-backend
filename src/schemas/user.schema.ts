import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: number;

  @Prop()
  middleName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  // TODO указать ссылку на коллекцию roles @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'roles' })
  @Prop()
  role: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
