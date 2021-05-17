import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';
import { KeyValue, Repository } from '../database/interfaces/repository.interface';
import { Patient } from './models/patient.model';

@Injectable()
export class PatientsService {
    constructor(@Inject('HAZELCAST_DB') private readonly repository: Repository<Patient>) {}

    async createNew(patient: CreatePatientDto): Promise<KeyValue<Patient>> {
        return await this.repository.put(new Patient({ ...patient }));
    }

    async deleteById(id: string): Promise<void> {
        this.repository.delete(id);
    }

    updateById(id: number, patient: UpdatePatientDto) {
        return patient;
    }

    async makeQuery(query: PaginationPatientDto): Promise<Patient[]> {
        return await this.repository.query(query)
    }

    async findById(id: string) {
        return await this.repository.get(id);
    }
}
