// booking.service.test.ts
import {
    getBookingDetailsById,
    getBookingWithPayment,
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
} from "../../booking/booking.service";
import { db } from "../../drizzle/db";

jest.mock("../../drizzle/db", () => {
    const mockWhere = jest.fn();
    const mockInnerJoin3 = jest.fn().mockReturnValue({ where: mockWhere });
    const mockInnerJoin2 = jest.fn().mockReturnValue({ innerJoin: mockInnerJoin3 });
    const mockInnerJoin1 = jest.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
    const mockFrom = jest.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

    return {
        db: {
            select: jest.fn(() => ({ from: mockFrom })),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
});

describe("Booking Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getBookingDetailsById", () => {
        it("should return booking details with customer, car and location", async () => {
            const mockResult = [
                {
                    booking: { bookingID: 1 },
                    customer: { customerID: 1 },
                    car: { carID: 1 },
                    location: { locationID: 1 },
                },
            ];

            const { db } = require("../../drizzle/db");
            const mockWhere = jest.fn().mockReturnValueOnce(mockResult);
            db.select().from().innerJoin().innerJoin().innerJoin = jest.fn().mockReturnValue({ where: mockWhere });

            const result = await getBookingDetailsById(1);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("getBookingWithPayment", () => {
        it("should return booking with payment, car and customer", async () => {
            const mockResult = [
                {
                    booking: { bookingID: 2 },
                    customer: { customerID: 2 },
                    car: { carID: 2 },
                    payment: { paymentID: 2 },
                },
            ];

            const { db } = require("../../drizzle/db");
            const mockWhere = jest.fn().mockReturnValueOnce(mockResult);
            db.select().from().innerJoin().innerJoin().innerJoin = jest.fn().mockReturnValue({ where: mockWhere });

            const result = await getBookingWithPayment(2);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("getAllBookings", () => {
        it("should return all bookings", async () => {
            const mockBookings = [{ bookingID: 1 }];
            (db.select as jest.Mock).mockReturnValue({ from: jest.fn().mockReturnValue(mockBookings) });

            const result = await getAllBookings();
            expect(result).toEqual(mockBookings);
        });
    });

    describe("getBookingById", () => {
        it("should return booking by ID", async () => {
            const mockBooking = [{ bookingID: 1 }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue(mockBooking),
                }),
            });

            const result = await getBookingById(1);
            expect(result).toEqual(mockBooking[0]);
        });
    });

    describe("createBooking", () => {
        it("should create a booking", async () => {
            const newBooking = { bookingID: 1 };
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([newBooking]),
                }),
            });

            const result = await createBooking({} as any);
            expect(result).toEqual(newBooking);
        });
    });

    describe("updateBooking", () => {
        it("should update a booking", async () => {
            const updatedBooking = { bookingID: 1 };
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce([updatedBooking]),
                    }),
                }),
            });

            const result = await updateBooking(1, {});
            expect(result).toEqual(updatedBooking);
        });
    });

    describe("deleteBooking", () => {
        it("should delete a booking", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ bookingID: 1 }]),
                }),
            });

            const result = await deleteBooking(1);
            expect(result).toBe(true);
        });

        it("should return false if no booking deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const result = await deleteBooking(1);
            expect(result).toBe(false);
        });
    });
});
