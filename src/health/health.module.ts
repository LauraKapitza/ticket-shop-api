import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { HealthController } from "./health.controller";
import { DatabaseService } from "../database/database.service";

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [HealthController],
    providers: [DatabaseService]
})
export class HealthModule {}
