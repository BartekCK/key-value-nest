import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';

@Injectable()
export class PatientsService {
    deleteById(id: number) {
        throw new Error('Method not implemented.');
    }

    updateById(id: number, patient: UpdatePatientDto) {
        throw new Error('Method not implemented.');
    }
    findAll(query: PaginationPatientDto) {
        throw new Error('Method not implemented.');
    }
    findById(id: number) {
        throw new Error('Method not implemented.');
    }
    createNew(patient: CreatePatientDto) {
        throw new Error('Method not implemented.');
    }
}
