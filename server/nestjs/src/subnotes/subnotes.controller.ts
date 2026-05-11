import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateSubnoteDto } from './dto/create-subnote';
import { UpdateSubnoteDto } from './dto/update-subnote';
import { SubnotesService } from './subnotes.service';

@Controller('subnotes')
@UseGuards(JwtAuthGuard)
export class SubnotesController {
    constructor(private readonly subnotesService: SubnotesService){}

    @Post()
    async create(@Body() createSubnoteDto: CreateSubnoteDto, @Req() req: any) {
        const subnoteData = {
            ...createSubnoteDto,
            userId: req.user.userId,
        };

        const result = await this.subnotesService.create(subnoteData);

        return{
            message: 'Subnote created successfully',
            data: result
        }
    }

    @Get(':noteId')
    async findByNote(@Param('noteId') noteId: string) {
        // You'll need to add a findByNote method in your service to make this work
        const subnotes = await this.subnotesService.findByNoteId(noteId);
        return { message: `Subnotes for note ${noteId}`, data: subnotes };
    }

@Put(':id')
async update(@Param('id') id: string, @Body() updateDto: UpdateSubnoteDto) {
    const updated = await this.subnotesService.update(id, updateDto);
    return { message: `Subnote ${id} updated`, data: updated };
}

@Delete(':id')
async remove(@Param('id') id: string) {
    await this.subnotesService.remove(id);
    return { message: `Subnote ${id} deleted` };
}
}