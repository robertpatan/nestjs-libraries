import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as path from "path";

// console.log(path.normalize(__dirname + '/../../../../src/**/*.entity.{ts,js}'));
// console.log(path.normalize(__dirname + './../../../../src/**/*.entity.{ts,js}'));

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        /**
         * we must inject ConfigService to be able to use env variables in the @Module decorator
         * it won't work in .forRoot
         */
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => ({
                type: 'postgres' as 'postgres', //cast is important to specify which polymorphic type of TypeOrmModuleOptions you’re returning from useFactory.
                host: 'localhost',
                port: configService.get<number>('DB_PORT', 5432), //fallback are important to get right as type for the port property, otherwise the TypeScript compiler is not happy with the useFactory implementation
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + './../../../../**/**/*.entity.{ts,js}'],
                synchronize: true,
                autoLoadEntities: true,
                logging: true,
                logger: 'file' as 'file',
                migrations: [__dirname  + './../../../../**/database/migrations/*{.ts,.js}'],
                seeds: [__dirname  + './../../../../**/database/seeds/*.seed.ts'],
                cli: {
                    // Location of migration should be inside src folder
                    // to be compiled into dist/ folder.
                    migrationsDir: 'src/database/migrations',
                }
            })
        }),
    ],
    providers: [],
    exports: []
})
export class PostgresSQL {}
