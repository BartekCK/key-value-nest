import { Injectable } from '@nestjs/common';
import { KeyValue, Repository } from '../interfaces/repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { DocumentClient, GetItemOutput, PutItemInput, PutItemInputAttributeMap, ScanOutput } from 'aws-sdk/clients/dynamodb';

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
        return (result.Item as unknown) as T;
    }

    async getAll(): Promise<T[]> {
        const params = {
            TableName: this.docName,
        };
        const result: ScanOutput = await this.docClient.scan(params).promise();
        return result.Items as unknown as T[];
    }

    async query(entity: Partial<T>): Promise<T[]> {
        return this.getAll();
    }

    async update(key: string, entity: Partial<T | any>): Promise<any> {}

    async delete(key: string): Promise<void> {}

    private generateId(): string {
        return uuidv4();
    }
}
