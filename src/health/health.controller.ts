import { Controller, Get } from "@nestjs/common";
import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    PrismaHealthIndicator
} from "@nestjs/terminus";
import { DatabaseService } from "../database/database.service";

@Controller("health")
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: PrismaHealthIndicator,
        private databaseService: DatabaseService
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck("nestjs-docs", "https://docs.nestjs.com"),
            () => this.db.pingCheck("database", this.databaseService)
        ]);
    }
}
