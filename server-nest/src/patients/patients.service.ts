import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create.patient.dto';
import { PaginationPatientDto } from './dto/pagination.patient.dto';
import { UpdatePatientDto } from './dto/update.patient.dto';
import { KeyValue, Repository } from '../database/interfaces/repository.interface';
import { Patient } from './models/patient.model';
import { DynamoDbProvider } from '../database/providers/dynamodb.provider';
import { ScanInput } from 'aws-sdk/clients/dynamodb';

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

    async dbProcessing() {
        if (!(this.repository instanceof DynamoDbProvider)) {
            throw new NotImplementedException('This kind of operation is only for DynamoDB');
        }
        console.time('Db processing');
        const { client, tableName } = this.repository.getInstance();

        const params: ScanInput = {
            TableName: tableName,
            FilterExpression: 'size(vaccinationReservations) = :max_nb',
            ExpressionAttributeValues: {
                // @ts-ignore
                ':max_nb': 2,
            },
        };
        const result = await client.scan(params).promise();
        await Promise.all(result.Items.map((el) => {
            return this.repository.delete(el.key);
        }))
        console.timeEnd('Db processing');
    }
}
