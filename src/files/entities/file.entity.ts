import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Expose, Transform, Type } from 'class-transformer';
import { Roles } from '../../shared/constants/enums/roles.enum';
import { User } from '../../users/entities/user.entity';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Transform((value) => value.obj._id.toString())
  @Expose({ groups: [Roles.ADMINISTRATOR] })
  _id: string;

  @Prop({ type: SchemaTypes.String })
  name: string;

  @Prop({ type: SchemaTypes.String })
  path: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Type(() => User)
  @Expose({ groups: [Roles.ADMINISTRATOR, Roles.MODERATOR] })
  createdBy: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Type(() => User)
  @Expose({ groups: [Roles.ADMINISTRATOR, Roles.MODERATOR] })
  updatedBy: User;

  @Prop({ type: SchemaTypes.Date })
  @Expose({ groups: [Roles.ADMINISTRATOR, Roles.MODERATOR] })
  createdAt?: Date;

  @Prop({ type: SchemaTypes.Date })
  @Expose({ groups: [Roles.ADMINISTRATOR, Roles.MODERATOR] })
  updatedAt?: Date;
}

export const FileEntity = SchemaFactory.createForClass(File);
