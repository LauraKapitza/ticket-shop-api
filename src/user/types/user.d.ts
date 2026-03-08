import type { JwtPayload } from "../../auth/types/jwt-payload";
import { FastifyRequest } from "fastify";

export type UserRequest = FastifyRequest & { user: JwtPayload };
