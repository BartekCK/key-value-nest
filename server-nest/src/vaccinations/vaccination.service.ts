import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/createVaccinationDto';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/models/patient.model';
import { Vaccination } from '../common/models/vaccination.model';

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
                elPatient.vaccinationReservations.find((el) => new Date(el.date).getTime() === new Date(roundDate).getTime()),
        );
        if (result) {
            throw new ConflictException(`${roundDate} is busy`);
        }
        patient.vaccinationReservations.push(new Vaccination(count, this.roundMinutes(date)));
        this.patientService.updateById(id, { ...patient });
    }

    private roundMinutes(date: Date) {
        date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
        date.setMinutes(0, 0, 0);
        return date;
    }
}
