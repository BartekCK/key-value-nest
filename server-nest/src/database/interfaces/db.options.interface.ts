export enum DatabaseType {
    Hazelcast,
    Amazon,
}

export interface DbOptionsInterface {
    port: string;
    host: string;
    dataBaseType: DatabaseType;
}
