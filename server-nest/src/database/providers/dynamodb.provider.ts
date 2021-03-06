import { Injectable, NotFoundException } from '@nestjs/common';
import { KeyValue, Repository } from '../interfaces/repository.interface';
import { v4 as uuidv4 } from 'uuid';
import {
    DeleteItemOutput,
    DocumentClient,
    GetItemOutput,
    PutItemInput,
    PutItemInputAttributeMap,
    ScanInput,
    ScanOutput,
    UpdateItemInput,
    UpdateItemOutput,
} from 'aws-sdk/clients/dynamodb';

@Injectable()
export class DynamoDbProvider<T> implements Repository<T> {
    constructor(private readonly docClient: DocumentClient, private readonly docName: string) {}

    getInstance() {
        return { tableName: this.docName, client: this.docClient };
    }

    async put(entity: T): Promise<KeyValue<T>> {
        // @ts-ignore
        const key = entity.key ? entity.key : this.generateId();
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
        try {
            this.checkIsExist('', entity);
        } catch (e) {
            return this.getAll();
        }

        const createFilter = (entity): string => {
            if (entity.name && !entity.surname) {
                return '#na = :naa';
            }
            if (!entity.name && entity.surname) {
                return 'surname = :sur';
            }
            return '#na = :naa and surname = :sur';
        };

        const createExpression = (entity): any => {
            if (entity.name && !entity.surname) {
                return {
                    ':naa': entity.name,
                };
            }
            if (!entity.name && entity.surname) {
                return {
                    ':sur': entity.surname,
                };
            }
            return {
                ':naa': entity.name,
                ':sur': entity.surname,
            };
        };

        const params: ScanInput | any = {
            TableName: this.docName,
            FilterExpression: createFilter(entity),
            // @ts-ignore
            ExpressionAttributeNames: entity.name && { '#na': 'name' },
            ExpressionAttributeValues: createExpression(entity),
        };
        const result: ScanOutput = await this.docClient.scan(params).promise();
        return result.Items as any;
    }

    async update(key: string, entityObj: Partial<T | any>): Promise<any> {
        const entity: any = JSON.parse(JSON.stringify(entityObj));
        // console.log(entity);
        // const createExpression = (entity) => {
        //     if (entity.surname && !entity.vaccinationReservations) {
        //         return { ':s': entity.surname };
        //     }
        //     if (!entity.surname && entity.vaccinationReservations) {
        //         return { ':v': entity.vaccinationReservations };
        //     }
        //
        //     return { ':s': entity.surname, ':v': entity.vaccinationReservations };
        // };
        //
        // const createUpdateExpression = (entity): string => {
        //     if (entity.surname && !entity.vaccinationReservations) {
        //         return 'set surname=:s';
        //     }
        //     if (!entity.surname && entity.vaccinationReservations) {
        //         return 'set vaccinationReservations=:v';
        //     }
        //     return 'set surname=:s, vaccinationReservations=:v';
        //
        // };
        //
        // const params: UpdateItemInput = {
        //     TableName: this.docName,
        //     // @ts-ignore
        //     Key: { key },
        //     UpdateExpression: createUpdateExpression(entity),
        //     ExpressionAttributeValues: createExpression(entity),
        //     ReturnValues: 'UPDATED_NEW',
        // };
        //
        // const result: UpdateItemOutput = await this.docClient.update(params).promise();
        // return result.Attributes;

        const result: any = await this.get(key);
        await this.delete(result.key);
        await this.put({ ...result, ...entity });

        // return Promise.resolve({})
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
