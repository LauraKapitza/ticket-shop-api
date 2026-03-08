import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { SignInDto } from "./dto/signin.dto";

@Controller("api/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.login(signInDto.email, signInDto.password);
    }
}
