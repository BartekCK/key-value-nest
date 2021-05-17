import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseType } from './database/interfaces/db.options.interface';
import { VaccinationModule } from './vaccinations/vaccination.module';

@Module({
    imports: [
        PatientsModule,
        VaccinationModule,
        DatabaseModule.forRoot({ port: '5432', host: 'hazelcast', dataBaseType: DatabaseType.Hazelcast }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
