// __tests__/unit-Test/maintenance.service.test.ts
import {
    getAllMaintenanceRecords,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
} from "../../mantainance/maintenance.service";

import { db } from "../../drizzle/db";
import { MaintenanceTable } from "../../drizzle/schema";

jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Maintenance Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllMaintenanceRecords", () => {
        it("should return all maintenance records", async () => {
            const mockRecords = [{ maintenanceID: 1, description: "Oil change" }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue(mockRecords),
            });

            const result = await getAllMaintenanceRecords();
            expect(result).toEqual(mockRecords);
        });
    });

    describe("getMaintenanceById", () => {
        it("should return a maintenance record by ID", async () => {
            const mockRecord = { maintenanceID: 1, description: "Brake check" };
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue([mockRecord]),
                }),
            });

            const result = await getMaintenanceById(1);
            expect(result).toEqual(mockRecord);
        });
    });

    describe("createMaintenance", () => {
        it("should create a new maintenance record", async () => {
            const mockInsert = [{ maintenanceID: 2, description: "Tire rotation" }];
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockInsert),
                }),
            });

            const result = await createMaintenance({
                description: "Tire rotation",
                carID: 1,
                maintenanceDate: new Date().toString(),
                cost: 100.00.toString()
            });
            expect(result).toEqual(mockInsert);
        });
    });

    describe("updateMaintenance", () => {
        it("should update a maintenance record", async () => {
            const updated = [{ maintenanceID: 1, description: "Updated brakes" }];
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(updated),
                    }),
                }),
            });

            const result = await updateMaintenance(1, { description: "Updated brakes" });
            expect(result).toEqual(updated[0]);
        });
    });

    describe("deleteMaintenance", () => {
        it("should delete a maintenance record", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([{ maintenanceID: 1 }]),
                }),
            });

            const result = await deleteMaintenance(1);
            expect(result).toBe(true);
        });

        it("should return false if no record was deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([]),
                }),
            });

            const result = await deleteMaintenance(99);
            expect(result).toBe(false);
        });
    });
});
