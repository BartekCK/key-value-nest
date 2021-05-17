import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule.forFeature('patients')],
    providers: [PatientsService],
    controllers: [PatientsController],
})
export class PatientsModule {}
