import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import type { UserRequest } from "./types/user";

@Controller("api/users")
export class UserController {
    @UseGuards(AuthGuard)
    @Get("me")
    getProfile(@Req() request: UserRequest) {
        return request.user;
    }
}
