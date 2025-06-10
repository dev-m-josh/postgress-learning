import { getAllCars, getCarById, createCar, updateCar, deleteCar } from "../car/car.service";

// Mock the db module used in the service
jest.mock("../drizzle/db", () => {
    return {
        db: {
            select: jest.fn(() => ({
                from: jest.fn(() => [
                    {
                        carID: 1,
                        carModel: "Toyota Corolla",
                        year: "2020-01-01",
                        color: "Red",
                        rentalRate: "50.00",
                        availability: true,
                        locationID: 1,
                    },
                ]),
            })),

            insert: jest.fn(() => ({
                values: jest.fn(() => ({
                    returning: jest.fn(() =>
                        Promise.resolve([
                            {
                                carID: 1,
                                carModel: "Toyota Corolla",
                                year: "2020-01-01",
                                color: "Red",
                                rentalRate: "50.00",
                                availability: true,
                                locationID: 1,
                            },
                        ])
                    ),
                })),
            })),

            update: jest.fn(() => ({
                set: jest.fn(() => ({
                    where: jest.fn(() => ({
                        returning: jest.fn(() =>
                            Promise.resolve([
                                {
                                    carID: 1,
                                    carModel: "Updated Model",
                                    year: "2020-01-01",
                                    color: "Blue",
                                    rentalRate: "55.00",
                                    availability: true,
                                    locationID: 1,
                                },
                            ])
                        ),
                    })),
                })),
            })),

            delete: jest.fn(() => ({
                where: jest.fn(() => ({
                    returning: jest.fn(() => Promise.resolve([{ carID: 1 }])),
                })),
            })),
        },
    };
});

describe("CarService", () => {
    it("should get all cars", async () => {
        const result = await getAllCars();
        expect(result).toEqual([
            {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
        ]);
    });

    // it("should get a car by ID", async () => {
    //     const result = await getCarById(1);
    //     expect(result).toEqual({
    //         carID: 1,
    //         carModel: "Toyota Corolla",
    //         year: "2020-01-01",
    //         color: "Red",
    //         rentalRate: "50.00",
    //         availability: true,
    //         locationID: 1,
    //     });
    // });

    it("should create a new car", async () => {
        const newCar = {
            carModel: "Toyota Corolla",
            year: "2020-01-01",
            color: "Red",
            rentalRate: "50.00",
            availability: true,
            locationID: 1,
        };
        const result = await createCar(newCar);
        expect(result.carModel).toBe("Toyota Corolla");
    });

    it("should update a car", async () => {
        const updatedData = {
            carModel: "Updated Model",
            color: "Blue",
            rentalRate: "55.00",
        };
        const result = await updateCar(1, updatedData);
        expect(result?.carModel).toBe("Updated Model");
        expect(result?.color).toBe("Blue");
    });

    it("should delete a car", async () => {
        const result = await deleteCar(1);
        expect(result).toBe(true);
    });
});

afterEach(() => {
    jest.clearAllMocks();
});