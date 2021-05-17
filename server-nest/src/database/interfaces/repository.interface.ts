export type KeyValue<T> = { [key: string]: T };

export interface Repository<T> {
    put: (entity: T) => Promise<KeyValue<T>>;
    get: (key: string) => Promise<T>;
    getAll: () => Promise<T[]>;
    query: (entity: Partial<T>) => Promise<T[]>;
    update: (key: string, entity: T) => any;
    delete: (key: string) => any;
}
