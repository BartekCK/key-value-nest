import { Injectable, NotFoundException } from '@nestjs/common';
import { KeyValue, Repository } from '../interfaces/repository.interface';
import { v4 as uuidv4 } from 'uuid';
import {
    DeleteItemOutput,
    DocumentClient,
    GetItemOutput,
    PutItemInput,
    PutItemInputAttributeMap,
    ScanOutput,
    UpdateItemInput,
    UpdateItemOutput,
} from 'aws-sdk/clients/dynamodb';

@Injectable()
export class DynamoDbProvider<T> implements Repository<T> {
    constructor(private readonly docClient: DocumentClient, private readonly docName: string) {}

    async put(entity: T): Promise<KeyValue<T>> {
        const key = this.generateId();
        const Item: PutItemInputAttributeMap = ({
            key,
            ...entity,
        } as unknown) as PutItemInputAttributeMap;

        const params: PutItemInput = {
            TableName: this.docName,
            Item,
        };

        await this.docClient.put(params).promise();
        const result: T = await this.get(key);
        return { [key]: result };
    }

    async get(key: string): Promise<T> {
        const result: GetItemOutput = await this.docClient.get({ TableName: this.docName, Key: { key } }).promise();
        this.checkIsExist(key, result);
        return (result.Item as unknown) as T;
    }

    async getAll(): Promise<T[]> {
        const params = {
            TableName: this.docName,
        };
        const result: ScanOutput = await this.docClient.scan(params).promise();
        return (result.Items as unknown) as T[];
    }

    async query(entity: Partial<T>): Promise<T[]> {
        return this.getAll();
    }

    async update(key: string, entity: Partial<T | any>): Promise<any> {
        const createExpression = (entity) => {
            if (entity.vaccinationReservations) {
                return { ':s': entity.surname, ':v': entity.vaccinationReservations };
            }
            return { ':s': entity.surname };
        };

        const createUpdateExpression = (entity): string => {
            if (entity.vaccinationReservations) {
                return 'set surname=:s, vaccinationReservations=:v';
            }
            return 'set surname=:s';
        };

        const params: UpdateItemInput = {
            TableName: this.docName,
            // @ts-ignore
            Key: { key },
            UpdateExpression: createUpdateExpression(entity),
            ExpressionAttributeValues: createExpression(entity),
            ReturnValues: 'ALL_NEW',
        };

        const result: UpdateItemOutput = await this.docClient.update(params).promise();
        return result.Attributes;
    }

    async delete(key: string): Promise<void> {
        const params = {
            TableName: this.docName,
            Key: { key },
        };
        const result: DeleteItemOutput = await this.docClient.delete(params).promise();
    }

    private generateId(): string {
        return uuidv4();
    }

    private checkIsExist(key: string, obj: Object) {
        if (Object.keys(obj).length === 0) {
            throw new NotFoundException(`Patient by key ${key} not found`);
        }
    }
}
