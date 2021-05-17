import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DbOptionsInterface } from './interfaces/db.options.interface';
import { Client } from 'hazelcast-client';
import { HazelcastClient } from 'hazelcast-client/lib/HazelcastClient';
import { HazelcastProvider } from './providers/hazelcast.provider';

@Module({})
export class DatabaseModule {
    private static hazelcastClient: HazelcastClient;

    constructor() {
        console.log('Database module init');
    }

    static async forRoot(options: DbOptionsInterface): Promise<DynamicModule> {
        const { dataBaseType, host, port } = options;
        this.hazelcastClient = await Client.newHazelcastClient();
        return { module: DatabaseModule };
    }

    static forFeature(mapName: string): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'HAZELCAST_DB',
                    useFactory: () => {
                        return new HazelcastProvider(this.hazelcastClient, mapName);
                    },
                },
            ],
            exports:['HAZELCAST_DB']
        };
    }
}
