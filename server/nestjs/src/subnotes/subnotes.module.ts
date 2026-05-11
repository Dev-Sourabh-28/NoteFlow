import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubnotesController } from './subnotes.controller';
import { Subnote, SubnoteSchema } from './subnote.schema';
import { SubnotesService } from './subnotes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subnote.name, schema: SubnoteSchema }])
  ],
  controllers: [SubnotesController],
  providers: [SubnotesService],
})
export class SubnotesModule {}