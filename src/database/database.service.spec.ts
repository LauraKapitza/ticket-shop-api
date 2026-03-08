import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "./database.service";

describe("DatabaseService", () => {
    let service: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: DatabaseService,
                    useValue: {
                        $connect: jest.fn(),
                        $disconnect: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get(DatabaseService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
