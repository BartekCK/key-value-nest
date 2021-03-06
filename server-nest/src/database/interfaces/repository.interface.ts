import { HazelcastClient } from 'hazelcast-client/lib/HazelcastClient';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export type KeyValue<T> = { [key: string]: T };

export interface Repository<T> {
    put: (entity: T) => Promise<KeyValue<T>>;
    get: (key: string) => Promise<T>;
    getAll: () => Promise<T[]>;
    query: (entity: Partial<T | any>) => Promise<T[]>;
    update: (key: string, entity: Partial<T | any>) => any;
    delete: (key: string) => any;
    getInstance: () => ({ tableName: string; client: HazelcastClient | DocumentClient });
}
