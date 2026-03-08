import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { mockUser, mockUserPassword } from "../../test/mock-data";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockToken = {
        access_token: "mock-jwt-token",
        user: mockUser
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn().mockResolvedValue(mockToken)
                    }
                },
                {
                    provide: JwtService,
                    useValue: { verifyAsync: jest.fn() }
                },
                Reflector
            ]
        }).compile();

        controller = module.get(AuthController);
        authService = module.get(AuthService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("signIn", () => {
        it("should call authService.login and return the token", async () => {
            const signInDto = {
                email: mockUser.email,
                password: `${mockUser.id}${mockUserPassword}`
            };

            const result = await controller.signIn(signInDto);

            expect(authService.login).toHaveBeenCalledWith(
                signInDto.email,
                signInDto.password
            );
            expect(result).toEqual(mockToken);
        });
    });
});
