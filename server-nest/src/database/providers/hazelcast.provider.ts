import { Injectable } from '@nestjs/common';
import { KeyValue, Repository } from '../interfaces/repository.interface';
import { HazelcastClient } from 'hazelcast-client/lib/HazelcastClient';
import { IMap } from 'hazelcast-client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HazelcastProvider<T> implements Repository<T> {
    private map: IMap<string, T>;
    constructor(private readonly hazelcastClient: HazelcastClient, private readonly mapName: string) {
        this.hazelcastClient.getMap(this.mapName).then((res: IMap<string, T>) => (this.map = res));
    }

    async put(entity: T): Promise<KeyValue<T>> {
        const key: string = this.generateId();
        await this.map.put(key, entity);
        return { [key]: entity };
    }

    get(key: string): Promise<T> {
        return this.map.get(key);
    }

    query(entity: Partial<T>): Promise<T[]> {
        return Promise.resolve([]);
    }

    update(key: string, entity: T): any {}

    async delete(key: string): Promise<void> {
        await this.map.delete(key);
    }

    private generateId(): string {
        return uuidv4();
    }
}
