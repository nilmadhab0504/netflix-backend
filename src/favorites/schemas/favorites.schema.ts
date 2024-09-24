import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Favorite extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  movieId: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
