import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permission } from './permission.schema';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Permission' }],
  })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
