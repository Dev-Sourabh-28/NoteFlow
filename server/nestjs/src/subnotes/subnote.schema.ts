import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

@Schema({collection: 'subnotes'})
export class Subnote extends Document{
  @Prop()
  title: string;
  
  @Prop()
  content: string;
  
  @Prop({type: Types.ObjectId, ref: 'Note'})
  noteId: string;

  @Prop({type: Types.ObjectId, ref: 'User'})
  userId: string;
}

export const SubnoteSchema = SchemaFactory.createForClass(Subnote);

