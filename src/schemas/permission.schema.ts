import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Expose, Transform } from 'class-transformer';
import { Roles } from '../shared/constants/enums/roles.enum';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: SchemaTypes.ObjectId })
  @Transform((value) => value.obj._id.toString())
  @Expose({ groups: [Roles.ADMINISTRATOR] })
  _id: string;

  @Prop({ type: SchemaTypes.String })
  name: string;

  @Prop({ type: SchemaTypes.String })
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
