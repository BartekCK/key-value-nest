import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseType } from './database/interfaces/db.options.interface';

@Module({
    imports: [
        PatientsModule,
        DatabaseModule.forRoot({ port: '5432', host: 'hazelcast', dataBaseType: DatabaseType.Hazelcast }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
