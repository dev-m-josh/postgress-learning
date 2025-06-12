import {
    getCustomerDetails,
    getCustomerReservationDetails,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from "../../customer/customer.service";
import { db } from "../../drizzle/db";
import { CustomerTable } from "../../drizzle/schema";


// Mock Drizzle's chained methods
jest.mock("../../drizzle/db", () => {
    const mockWhere = jest.fn();
    const mockLeftJoin2 = jest.fn().mockReturnValue({ where: mockWhere });
    const mockLeftJoin1 = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin2 });
    const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin1 });

    return {
        db: {
            select: jest.fn(() => ({
                from: mockFrom,
            })),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
});

describe("Customer Service - Joins", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return customer details with bookings and cars", async () => {
        const mockResult = [
            {
                customer: { customerID: 1, firstName: "Jane" },
                booking: { bookingID: 100, carID: 5 },
                car: { carID: 5, make: "Toyota" },
            },
        ];

        const { db } = require("../../drizzle/db");
        const mockWhere = db.select().from().leftJoin().leftJoin().where;
        mockWhere.mockReturnValueOnce(mockResult);

        const result = await getCustomerDetails(1);
        expect(result).toEqual(mockResult);
    });

    it("should return customer details with reservations and cars", async () => {
        const mockResult = [
            {
                customer: { customerID: 2, firstName: "Alex" },
                reservation: { reservationID: 200, carID: 9 },
                car: { carID: 9, make: "Honda" },
            },
        ];

        const { db } = require("../../drizzle/db");
        const mockWhere = db.select().from().leftJoin().leftJoin().where;
        mockWhere.mockReturnValueOnce(mockResult);

        const result = await getCustomerReservationDetails(2);
        expect(result).toEqual(mockResult);
    });

    describe("getAllCustomers", () => {
        it("should return all customers", async () => {
            const mockCustomers = [
                {
                    customerID: 1,
                    firstName: "Iann",
                    lastName: "Duncan",
                    email: "Ina@example.com",
                    phoneNumber: "555-1234",
                    address: "1 Elm St",
                },
            ];

            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue(mockCustomers),
            });

            const result = await getAllCustomers();
            expect(result).toEqual(mockCustomers);
        });

        it("should return empty array if no customers", async () => {
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue([]),
            });

            const result = await getAllCustomers();
            expect(result).toEqual([]);
        });
    });

    describe("getCustomerById", () => {
        it("should return the customer if found", async () => {
            const mockCustomer = {
                customerID: 1,
                firstName: "Iann",
                lastName: "Duncan",
                email: "Ina@example.com",
                phoneNumber: "555-1234",
                address: "1 Elm St",
            };

            const mockWhere = jest.fn().mockReturnValue([mockCustomer]);
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: mockWhere,
                }),
            });

            const result = await getCustomerById(1);
            expect(result).toEqual(mockCustomer);
        });

        it("should return null if customer not found", async () => {
            const mockWhere = jest.fn().mockReturnValue([]);
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: mockWhere,
                }),
            });

            const result = await getCustomerById(999);
            expect(result).toBe(undefined);
        });
    });

    describe("updateCustomer", () => {
        it("should update a customer and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce([{ customerID: 1 }]),
                    }),
                }),
            });

            const result = await updateCustomer(1, {
                firstName: "Updated",
            });

            expect(db.update).toHaveBeenCalledWith(CustomerTable);
            expect(result).toStrictEqual({ customerID: 1 });
        });

        it("should return null if no rows updated", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce([]),
                    }),
                }),
            });

            const result = await updateCustomer(1, {
                firstName: "Updated",
            });

            expect(result).toBe(undefined);
        });
    });

    describe("deleteCustomer", () => {
        it("should delete a customer and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ customerID: 1 }]),
                }),
            });

            const result = await deleteCustomer(1);
            expect(db.delete).toHaveBeenCalledWith(CustomerTable);
            expect(result).toBe(true);
        });

        it("should return null if no rows deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const result = await deleteCustomer(1);
            expect(result).toBe(false);
        });
    });
});
