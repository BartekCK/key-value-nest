import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PatientsService } from './patients.service';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Post()
    addNewPatient(@Body() patient: CreatePatientDto) {
        return this.patientsService.createNew(patient);
    }

    @Get(':id')
    getPatientById(@Param('id') id: number) {
        return this.patientsService.findById(id);
    }

    @ApiQuery({ type: () => PaginationPatientDto })
    @Get()
    getAllPatients(@Query() query: PaginationPatientDto) {
        return this.patientsService.findAll(query);
    }

    @Patch(':id')
    updatePatient(@Param('id') id: number, @Body() patient: UpdatePatientDto) {
        return this.patientsService.updateById(id, patient);
    }

    @Delete(':id')
    deletePatientById(@Param('id') id: number) {
        return this.patientsService.deleteById(id);
    }
}
