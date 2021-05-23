import { Injectable, NotFoundException } from '@nestjs/common';
import { KeyValue, Repository } from '../interfaces/repository.interface';
import { HazelcastClient } from 'hazelcast-client/lib/HazelcastClient';
import { IMap, Predicates } from 'hazelcast-client';
import { v4 as uuidv4 } from 'uuid';
import { Predicate } from 'hazelcast-client/lib/core/Predicate';

@Injectable()
export class HazelcastProvider<T> implements Repository<T> {


    private map: IMap<string, T>;
    constructor(private readonly hazelcastClient: HazelcastClient, private readonly mapName: string) {
        this.hazelcastClient.getMap(this.mapName).then((res: IMap<string, T>) => (this.map = res));
    }

    getInstance() {
        return { tableName: this.mapName, client: this.hazelcastClient };
    }

    async put(entity: T): Promise<KeyValue<T>> {
        const key: string = this.generateId();
        await this.map.put(key, entity);
        return { [key]: entity };
    }

    async get(key: string): Promise<T> {
        const obj = await this.map.get(key);
        if (!obj) {
            throw new NotFoundException(`Can not find ${key} key`);
        }
        return obj;
    }

    async getAll(): Promise<T[]> {
        return (await this.map.values()).toArray();
    }

    async query(entity: Partial<T>): Promise<T[]> {
        const predicates: Predicate[] = Object.entries(entity).reduce((prev: Predicate[], [key, value]) => {
            if (value) {
                return [...prev, Predicates.equal(key, value)];
            }
            return prev;
        }, []);
        const criteriaQuery = Predicates.and(...predicates);
        return (await this.map.valuesWithPredicate(criteriaQuery)).toArray();
    }

    async update(key: string, entity: Partial<T | any>): Promise<any> {
        const obj: T = await this.get(key);
        return this.map.replace(key, { ...obj, ...entity });
    }

    async delete(key: string): Promise<void> {
        await this.map.get(key);
        await this.map.delete(key);
    }

    private generateId(): string {
        return uuidv4();
    }
}
