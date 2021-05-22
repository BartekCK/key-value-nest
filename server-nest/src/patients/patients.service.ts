import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';
import { KeyValue, Repository } from '../database/interfaces/repository.interface';
import { Patient } from './models/patient.model';

@Injectable()
export class PatientsService {
    constructor(@Inject('REPOSITORY') private readonly repository: Repository<Patient>) {}

    async createNew(patient: CreatePatientDto): Promise<KeyValue<Patient>> {
        return await this.repository.put(new Patient({ ...patient }));
    }

    async deleteById(id: string): Promise<void> {
        this.repository.delete(id);
    }

    updateById(id: string, patient: UpdatePatientDto) {
        return this.repository.update(id, { ...patient });
    }

    async makeQuery(query: PaginationPatientDto): Promise<Patient[]> {
        return await this.repository.query(query);
    }

    async findById(id: string) {
        return await this.repository.get(id);
    }

    async findAll() {
        return await this.repository.getAll();
    }
}
