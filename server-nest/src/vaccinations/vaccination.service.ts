import { BadRequestException, ConflictException, Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/createVaccinationDto';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/models/patient.model';
import { Vaccination } from '../common/models/vaccination.model';
import { Repository } from '../database/interfaces/repository.interface';
import { DynamoDbProvider } from '../database/providers/dynamodb.provider';
import { DeleteItemInput, DeleteItemOutput, ScanInput } from 'aws-sdk/clients/dynamodb';

@Injectable()
export class VaccinationService {
    constructor(private readonly patientService: PatientsService) {}

    async createNewTherm(id: string, createVacDto: CreateVaccinationDto) {
        const { count, date } = createVacDto;
        const patient: Patient = await this.patientService.findById(id);
        if (patient.vaccinationReservations.length > 2) {
            throw new BadRequestException(`Patient ${id} has been vaccinated`);
        }
        if (patient.vaccinationReservations.length === 0 && createVacDto.count === 2) {
            throw new BadRequestException(`Patient ${id} did not get the first dose`);
        }
        if (patient.vaccinationReservations.find((el) => el.count === createVacDto.count)) {
            throw new BadRequestException(`Patient ${id} has already had this dose`);
        }

        const roundDate: Date = this.roundMinutes(date);
        const patients: Patient[] = await this.patientService.findAll();
        // By own predicate
        const result: Patient = patients.find(
            (elPatient) =>
                elPatient.vaccinationReservations &&
                elPatient.vaccinationReservations.find(
                    (el) => new Date(el.date).getTime() === new Date(roundDate).getTime(),
                ),
        );
        if (result) {
            throw new ConflictException(`${roundDate} is busy`);
        }
        patient.vaccinationReservations.push(new Vaccination(count, this.roundMinutes(date)));
        // @ts-ignore
        this.patientService.updateById(id, { vaccinationReservations: patient.vaccinationReservations });
    }

    async cleanUsedVaccinationService() {
        console.time('Service processing');
        const patients: any[] = await this.patientService.findAll();
        await Promise.all(
            patients.map(async (el) => {
                if (el.vaccinationReservations && el.vaccinationReservations.length === 2) {
                    return await this.patientService.deleteById(el.key);
                }
                return Promise.resolve({});
            }),
        );
        console.timeEnd('Service processing');
    }

    async cleanUsedVaccinationDb() {
       await this.patientService.dbProcessing();
    }

    private roundMinutes(date: Date) {
        date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
        date.setMinutes(0, 0, 0);
        return date;
    }
}
