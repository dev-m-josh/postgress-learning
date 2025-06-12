import {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    getLocationWithCars,
} from "../../location/location.service";

import { db } from "../../drizzle/db";
import { LocationTable } from "../../drizzle/schema";

jest.mock("../../drizzle/db", () => {
    const mockWhere = jest.fn();
    const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
    const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });

    return {
        db: {
            select: jest.fn(() => ({
                from: mockFrom,
                leftJoin: mockLeftJoin,
            })),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
});

describe("Location Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return all locations", async () => {
        const mockLocations = [{ locationID: 1, name: "Nairobi" }];
        (db.select as jest.Mock).mockReturnValue({ from: jest.fn().mockReturnValue(mockLocations) });

        const result = await getAllLocations();
        expect(result).toEqual(mockLocations);
    });

    it("should return location by ID if found", async () => {
        const mockLocation = [{ locationID: 1, name: "Nairobi" }];
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue(mockLocation),
            }),
        });

        const result = await getLocationById(1);
        expect(result).toEqual(mockLocation[0]);
    });

    it("should return undefined if location by ID not found", async () => {
        (db.select as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValue([]),
            }),
        });

        const result = await getLocationById(99);
        expect(result).toBeUndefined();
    });

    it("should create a new location", async () => {
        const locationData = { name: "Mombasa" };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ locationID: 1, ...locationData }]),
            }),
        });

        const result = await createLocation(locationData as any);
        expect(result).toEqual({ locationID: 1, ...locationData });
    });

    it("should update a location and return it", async () => {
        const updatedLocation = { locationID: 1, name: "Updated City" };
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([updatedLocation]),
                }),
            }),
        });

        const result = await updateLocation(1, { locationName: "Updated City" });
        expect(result).toEqual(updatedLocation);
    });

    it("should return undefined if update affected no rows", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            }),
        });

        const result = await updateLocation(1, { locationName: "No Update" });
        expect(result).toBeUndefined();
    });

    it("should delete a location and return true", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ locationID: 1 }]),
            }),
        });

        const result = await deleteLocation(1);
        expect(result).toBe(true);
    });

    it("should return false if no location deleted", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([]),
            }),
        });

        const result = await deleteLocation(1);
        expect(result).toBe(false);
    });

});
