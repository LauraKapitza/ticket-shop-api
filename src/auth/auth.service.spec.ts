import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { mockUser, mockUserPassword } from "../../test/mock-data";

describe("AuthService", () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findUnique: jest.fn()
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue("mock_token")
                    }
                }
            ]
        }).compile();

        service = module.get(AuthService);
        userService = module.get(UserService);
        jwtService = module.get(JwtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("login", () => {
        it("should return a token and user data for valid credentials", async () => {
            (userService.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const result = await service.login(
                mockUser.email,
                mockUserPassword
            );

            expect(result).toEqual({
                access_token: "mock_token",
                user: {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email
                }
            });
            expect(jwtService.signAsync).toHaveBeenCalled();
        });

        it("should throw UnauthorizedException if user is not found", async () => {
            (userService.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(
                service.login("wrong@example.com", mockUserPassword)
            ).rejects.toThrow(UnauthorizedException);
        });

        it("should throw UnauthorizedException for incorrect password", async () => {
            (userService.findUnique as jest.Mock).mockResolvedValue(mockUser);

            await expect(
                service.login(mockUser.email, "wrong_password")
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
