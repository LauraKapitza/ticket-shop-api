import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import md5 from "md5";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(email: string, pass: string) {
        const user = await this.userService.findUnique(email);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const computedHash: string | number[] = md5(`${user.id}${pass}`);

        if (computedHash !== user.password_hash) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { sub: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
}
