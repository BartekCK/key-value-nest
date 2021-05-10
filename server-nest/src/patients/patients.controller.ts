import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PatientsService } from './patients.service';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';
import { ApiTags } from '@nestjs/swagger';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { DeleteEmptyStringPipe } from '../common/pipes/deleteEmptyString.pipe';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Post()
    @UsePipes(TrimPipe, new ValidationPipe({ whitelist: true, transform: true }))
    addNewPatient(@Body() patient: CreatePatientDto) {
        return this.patientsService.createNew(patient);
    }

    @Patch(':id')
    @UsePipes(TrimPipe, DeleteEmptyStringPipe, new ValidationPipe({ whitelist: true, transform: true }))
    updatePatient(@Param('id') id: number, @Body() patient: UpdatePatientDto) {
        return this.patientsService.updateById(id, patient);
    }

    @Get()
    @UsePipes(TrimPipe, DeleteEmptyStringPipe, new ValidationPipe({ whitelist: true, transform: true }))
    getAllPatients(@Query() query: PaginationPatientDto) {
        return this.patientsService.findAll(query);
    }

    @Get(':id')
    getPatientById(@Param('id') id: number) {
        return this.patientsService.findById(id);
    }

    @Delete(':id')
    deletePatientById(@Param('id') id: number) {
        return this.patientsService.deleteById(id);
    }
}
