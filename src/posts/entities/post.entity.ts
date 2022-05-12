import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Expose, Transform, Type } from 'class-transformer';
import { Roles } from '../../shared/constants/enums/roles.enum';
import { User } from '../../schemas/user.schema';
import { File } from '../../schemas/file.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Transform((value) => value.obj._id.toString())
  @Expose({ groups: [Roles.ADMINISTRATOR] })
  _id: string;

  @Prop({ type: SchemaTypes.String })
  header: string;

  @Prop({ type: SchemaTypes.String })
  text: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'File' }])
  @Type(() => File)
  files: File[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Type(() => User)
  @Expose({ groups: [Roles.ADMINISTRATOR, Roles.MODERATOR] })
  createdBy: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  @Type(() => User)
  @Expose({ groups: [Roles.ADMINISTRATOR, Roles.MODERATOR] })
  updatedBy: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
