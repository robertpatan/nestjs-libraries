import { Module } from '@nestjs/common';
import {PostgresSQL} from "@app/database/postgres-sql.module";

@Module({
  imports: [PostgresSQL],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
