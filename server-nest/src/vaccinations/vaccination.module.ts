import { Module } from '@nestjs/common';
import { VaccinationController } from './vaccination.controller';
import { VaccinationService } from './vaccination.service';
import { PatientsModule } from '../patients/patients.module';

@Module({
    imports: [PatientsModule],
    controllers: [VaccinationController],
    providers: [VaccinationService],
})
export class VaccinationModule {}
