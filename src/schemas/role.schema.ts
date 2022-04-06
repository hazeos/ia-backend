import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Permission } from './permission.schema';
import { Expose, Transform, Type } from 'class-transformer';
import { Roles } from '../shared/constants/enums/roles.enum';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Transform((value) => value.obj._id.toString())
  @Expose({ groups: [Roles.ADMINISTRATOR] })
  _id: string;

  @Prop({ type: SchemaTypes.String })
  name: string;

  @Prop({ type: SchemaTypes.String })
  displayName: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }],
  })
  @Type(() => Permission)
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
