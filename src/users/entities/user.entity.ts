import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from '../../schemas/role.schema';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Roles } from '../../shared/constants/enums/roles.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @Prop({ type: SchemaTypes.String })
  firstName: string;

  @Prop({ type: SchemaTypes.String })
  lastName: string;

  @Prop({ type: SchemaTypes.String })
  middleName: string;

  @Prop({ type: SchemaTypes.String, unique: true })
  email: string;

  @Prop({ type: SchemaTypes.String })
  @Exclude()
  password: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Role' })
  @Type(() => Role)
  role: Role;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Type(() => User)
  @Expose({ groups: [Roles.ADMINISTRATOR] })
  createdBy: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Type(() => User)
  @Expose({ groups: [Roles.ADMINISTRATOR] })
  updatedBy: User;
}

export const UserEntity = SchemaFactory.createForClass(User);
