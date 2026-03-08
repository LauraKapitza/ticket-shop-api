import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DatabaseService } from "../database/database.service";
import { UserService } from "../user/user.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "3600s" }
            })
        })
    ],
    providers: [AuthService, DatabaseService, UserService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
