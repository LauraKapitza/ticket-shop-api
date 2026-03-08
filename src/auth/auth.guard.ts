import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { Reflector } from "@nestjs/core";
import { UserRequest } from "../user/types/user";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<UserRequest>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            request["user"] = await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: FastifyRequest): string | null {
        const authHeader = request.headers["authorization"];

        if (!authHeader) {
            return null;
        }

        const [type, token] = authHeader.split(" ") ?? [];
        return type === "Bearer" ? token : null;
    }
}
