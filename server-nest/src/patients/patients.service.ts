import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';

@Injectable()
export class PatientsService {
    createNew(patient: CreatePatientDto) {
        console.log(patient);
        return patient;
    }

    deleteById(id: number) {
        return id;
    }

    updateById(id: number, patient: UpdatePatientDto) {
        return patient;
    }

    findAll(query: PaginationPatientDto) {
        return query;
    }

    findById(id: number) {
        return id;
    }
}
