import { getLocationWithCars } from "../../location/location.service";
import { db } from "../../drizzle/db";
import { LocationTable } from "../../drizzle/schema";

jest.mock("../../drizzle/db", () => {
    const mockWhere = jest.fn();
    const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
    const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });

    return {
        db: {
            select: jest.fn(() => ({
                from: mockFrom,
            })),
        },
    };
});

describe("getLocationWithCars", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return location with cars", async () => {
        const mockResult = [
            {
                location: { locationID: 1, locationName: "Nairobi", address: "CBD" },
                car: { carID: 10, make: "Toyota", model: "Corolla", locationID: 1 },
            },
            {
                location: { locationID: 1, locationName: "Nairobi", address: "CBD" },
                car: { carID: 11, make: "Honda", model: "Fit", locationID: 1 },
            },
        ];

        const mockWhere = jest.fn().mockReturnValue(mockResult);
        const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
        const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });

        (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

        const result = await getLocationWithCars(1);

        expect(result.location).toEqual(mockResult[0].location);
        expect(result.cars).toEqual([mockResult[0].car, mockResult[1].car]);
    });

    it("should return message when no cars in location", async () => {
        const mockWhere = jest.fn().mockReturnValue([]);
        const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
        const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });

        (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

        const result = await getLocationWithCars(999);
        expect(result).toEqual({ message: "No cars in this Location" });
    });
});
