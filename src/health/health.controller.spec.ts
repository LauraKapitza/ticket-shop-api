import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import {
    HealthIndicatorFunction,
    HealthCheckResult,
    PrismaHealthIndicator
} from "@nestjs/terminus";
import { HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";
import { DatabaseService } from "../database/database.service";

describe("HealthController", () => {
    let controller: HealthController;
    let healthService: HealthCheckService;
    let httpIndicator: HttpHealthIndicator;
    let prismaIndicator: PrismaHealthIndicator;

    beforeEach(async () => {
        const mockResult: HealthCheckResult = {
            status: "ok",
            details: {
                "nestjs-docs": { status: "up" },
                database: { status: "up" }
            }
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthCheckService,
                    useValue: {
                        check: jest
                            .fn()
                            .mockImplementation(
                                async (
                                    indicators: HealthIndicatorFunction[]
                                ): Promise<HealthCheckResult> => {
                                    await Promise.all(
                                        indicators.map(async (fn) => fn())
                                    );
                                    return mockResult;
                                }
                            )
                    }
                },
                {
                    provide: HttpHealthIndicator,
                    useValue: {
                        pingCheck: jest.fn().mockResolvedValue({
                            "nestjs-docs": { status: "up" }
                        })
                    }
                },
                {
                    provide: PrismaHealthIndicator,
                    useValue: {
                        pingCheck: jest
                            .fn()
                            .mockResolvedValue({ database: { status: "up" } })
                    }
                },
                {
                    provide: DatabaseService,
                    useValue: {}
                }
            ]
        }).compile();

        controller = module.get(HealthController);
        healthService = module.get(HealthCheckService);
        httpIndicator = module.get(HttpHealthIndicator);
        prismaIndicator = module.get(PrismaHealthIndicator);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("check", () => {
        it("should call healthService.check with the correct indicators", async () => {
            const result = await controller.check();

            expect(healthService.check).toHaveBeenCalled();
            expect(httpIndicator.pingCheck).toHaveBeenCalledWith(
                "nestjs-docs",
                "https://docs.nestjs.com"
            );
            expect(prismaIndicator.pingCheck).toHaveBeenCalledWith(
                "database",
                expect.any(Object)
            );

            expect(result.status).toBe("ok");
            expect(result.details).toHaveProperty("nestjs-docs");
            expect(result.details).toHaveProperty("database");
        });
    });
});
