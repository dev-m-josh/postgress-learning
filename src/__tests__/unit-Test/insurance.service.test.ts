import {
    getAllInsuranceRecords,
    getInsuranceById,
    createInsurance,
    updateInsurance,
    deleteInsurance,
} from "../../insurance/insurance.service";
import { db } from "../../drizzle/db";
import { InsuranceTable } from "../../drizzle/schema";

// Mock the db module
jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Insurance Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllInsuranceRecords", () => {
        it("should return all insurance records", async () => {
            const mockData = [{ insuranceID: 1, provider: "Axa" }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue(mockData),
            });

            const result = await getAllInsuranceRecords();
            expect(result).toEqual(mockData);
        });
    });

    describe("getInsuranceById", () => {
        it("should return a specific insurance record", async () => {
            const mockData = [{ insuranceID: 1, provider: "Axa" }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue(mockData),
                }),
            });

            const result = await getInsuranceById(1);
            expect(result).toEqual(mockData[0]);
        });
    });

    describe("createInsurance", () => {
        it("should create a new insurance record", async () => {
            const inputData = {
                carID: 1,
                insuranceProvider: "Axa",
                policyNumber: "AXA-001",
                startDate: new Date("2024-01-01").toDateString(),
                endDate: new Date("2025-12-31").toDateString(),
            };

            const mockResult = [{ ...inputData, insuranceID: 1 }];
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce(mockResult),
                }),
            });

            const result = await createInsurance(inputData);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("updateInsurance", () => {
        it("should update an insurance record", async () => {
            const updateData = { insuranceProvider: "AIG" };
            const mockResult = [{ insuranceID: 1, ...updateData }];
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce(mockResult),
                    }),
                }),
            });

            const result = await updateInsurance(1, updateData);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("deleteInsurance", () => {
        it("should delete an insurance record", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ insuranceID: 1 }]),
                }),
            });

            const result = await deleteInsurance(1);
            expect(result).toBe(true);
        });

        it("should return false if no record was deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const result = await deleteInsurance(999);
            expect(result).toBe(false);
        });
    });
});
