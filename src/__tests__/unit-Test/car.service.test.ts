import { getAllCars, getCarById, createCar, updateCar, deleteCar } from "../../car/car.service";
import { db } from "../../drizzle/db";
import { CarTable } from "../../drizzle/schema";

jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Car Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllCars", () => {
        it("should return all cars", async () => {
            const mockCars = [{ carID: 1, make: "Toyota" }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue(mockCars),
            });

            const result = await getAllCars();
            expect(result).toEqual(mockCars);
        });
    });

    describe("getCarById", () => {
        it("should return car when found", async () => {
            const mockCar = [{ carID: 1, make: "Honda" }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue(mockCar),
                    }),
                }),
            });

            const result = await getCarById(1);
            expect(result).toEqual(mockCar[0]);
        });

        it("should return null if car not found", async () => {
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue([]),
                    }),
                }),
            });

            const result = await getCarById(99);
            expect(result).toBeNull();
        });
    });

    describe("createCar", () => {
        it("should create and return a car", async () => {
            const newCar = { carID: 1, make: "Nissan" };
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([newCar]),
                }),
            });

            const result = await createCar({} as any);
            expect(result).toEqual(newCar);
        });
    });

    describe("updateCar", () => {
        it("should update and return car if exists", async () => {
            const updatedCar = { carID: 1, make: "Tesla" };
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce([updatedCar]),
                    }),
                }),
            });

            const result = await updateCar(1, {});
            expect(result).toEqual(updatedCar);
        });

        it("should return null if update affects no rows", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce([]),
                    }),
                }),
            });

            const result = await updateCar(1, {});
            expect(result).toBeNull();
        });
    });

    describe("deleteCar", () => {
        it("should return true if a car is deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ carID: 1 }]),
                }),
            });

            const result = await deleteCar(1);
            expect(result).toBe(true);
        });

        it("should return false if no car is deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const result = await deleteCar(1);
            expect(result).toBe(false);
        });
    });
});
