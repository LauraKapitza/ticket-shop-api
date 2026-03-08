import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { mockUser } from "../../test/mock-data";

describe("UserController", () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        findUnique: jest.fn().mockResolvedValue(mockUser)
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest.fn()
                    }
                },
                Reflector
            ]
        }).compile();

        controller = module.get(UserController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getProfile", () => {
        it("should return the user object from the request", () => {
            const mockRequest = {
                user: {
                    id: mockUser.id,
                    email: mockUser.email,
                    name: mockUser.name
                }
            };

            const result = controller.getProfile(mockRequest as any);

            expect(result).toEqual(mockRequest.user);
        });
    });
});
