import { DynamicModule, Module } from '@nestjs/common';
import { DbOptionsInterface } from './interfaces/db.options.interface';
import { Client } from 'hazelcast-client';
import { HazelcastClient } from 'hazelcast-client/lib/HazelcastClient';
import { HazelcastProvider } from './providers/hazelcast.provider';
import { ConfigModule } from '@nestjs/config';
import { DynamoDbProvider } from './providers/dynamodb.provider';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

@Module({})
export class DatabaseModule {
    private static hazelcastClient: HazelcastClient;
    private static docClient: DocumentClient;

    constructor() {
        console.log('Database module init');
    }

    static async forRoot(options: DbOptionsInterface): Promise<DynamicModule> {
        const { dataBaseType, host, port } = options;
        if (process.env.DB_TYPE === 'DYNAMO_DB') {
            AWS.config.update({
                region: 'us-west-2',
                // @ts-ignore
                endpoint: 'http://localhost:8000',
            });
            const dynamodb = new AWS.DynamoDB();

            const params = {
                TableName : "patients",
                KeySchema: [
                    { AttributeName: "key", KeyType: "HASH"},  //Partition key
                ],
                AttributeDefinitions: [
                    { AttributeName: "key", AttributeType: "S" },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10
                }
            };
            // dynamodb.deleteTable(params)
            dynamodb.createTable(params, function(err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                }
            });

            this.docClient = new AWS.DynamoDB.DocumentClient();
        } else {
            this.hazelcastClient = await Client.newHazelcastClient();
        }
        return { imports: [ConfigModule], module: DatabaseModule };
    }

    static forFeature(name: string): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: 'REPOSITORY',
                    useFactory: () => {
                        if (process.env.DB_TYPE === 'DYNAMO_DB') {
                            return new DynamoDbProvider(this.docClient, name);
                        } else {
                            return new HazelcastProvider(this.hazelcastClient, name);
                        }
                    },
                },
            ],
            exports: ['REPOSITORY'],
        };
    }
}
