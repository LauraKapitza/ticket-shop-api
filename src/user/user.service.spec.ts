import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { DatabaseService } from "../database/database.service";
import { mockUser } from "../../test/mock-data";

describe("UserService", () => {
    let service: UserService;
    let dbService: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: DatabaseService,
                    useValue: {
                        users: {
                            findUnique: jest.fn()
                        }
                    }
                }
            ]
        }).compile();

        service = module.get(UserService);
        dbService = module.get(DatabaseService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findUnique", () => {
        it("should return a user if found", async () => {
            (dbService.users.findUnique as jest.Mock).mockResolvedValue(
                mockUser
            );

            const result = await service.findUnique(mockUser.email);

            expect(result).toEqual(mockUser);
            expect(dbService.users.findUnique).toHaveBeenCalledWith({
                where: { email: mockUser.email }
            });
        });

        it("should return null if user is not found", async () => {
            (dbService.users.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await service.findUnique("notfound@example.com");

            expect(result).toBeNull();
        });
    });
});
