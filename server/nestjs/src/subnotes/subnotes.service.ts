import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subnote } from './subnote.schema';

@Injectable()
export class SubnotesService {
    constructor(
        @InjectModel(Subnote.name) private subnoteModel: Model<Subnote>,
    ){}

    async create(data: any): Promise<Subnote>{
        const newSubnote = new this.subnoteModel(data);
        return await newSubnote.save();
    }

    async findAll(userId: string) : Promise<Subnote[]>{
        return await this.subnoteModel.find({userId}).exec();
    }

    async findByNoteId(noteId: string): Promise<Subnote[]>{
        return await this.subnoteModel.find({noteId}).exec();
    }

    // Change the return type to include | null
async update(id: string, updateDto: any): Promise<Subnote | null> {
    return await this.subnoteModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
}

async remove(id: string): Promise<Subnote | null> {
    return await this.subnoteModel.findByIdAndDelete(id).exec();
}
}
