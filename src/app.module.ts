import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot(),
        DatabaseModule,
        HealthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
