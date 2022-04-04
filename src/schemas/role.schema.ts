import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permission } from './permission.schema';
import { Transform, Type } from 'class-transformer';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop()
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Permission' }],
  })
  @Type(() => Permission)
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
