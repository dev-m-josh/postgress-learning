import {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
} from "../../reservation/reservation.service";
import { db } from "../../drizzle/db";
import { ReservationTable } from "../../drizzle/schema";
import car from "../../car/car.routes";

jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Reservation Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllReservations", () => {
        it("should return all reservations", async () => {
            const mockData = [{ reservationID: 1, customerID: 2 }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue(mockData),
            });

            const result = await getAllReservations();
            expect(result).toEqual(mockData);
        });
    });

    describe("getReservationById", () => {
        it("should return reservation by ID", async () => {
            const mockData = [{ reservationID: 1, customerID: 2 }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue(mockData),
                }),
            });

            const result = await getReservationById(1);
            expect(result).toEqual(mockData[0]);
        });
    });

    describe("createReservation", () => {
        it("should create a new reservation", async () => {
            const inputData = {
                customerID: 2,
                carID: 3,
                reservationDate: new Date("2025-06-11").toDateString(),
                returnDate: new Date("2025-06-20").toDateString(),
                pickupDate: new Date("2025-06-15").toDateString(),
            };

            const mockResult = [{ ...inputData, reservationID: 1 }];
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce(mockResult),
                }),
            });

            const result = await createReservation(inputData);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("updateReservation", () => {
        it("should update a reservation", async () => {
            const updateData = { carID: 2, reservationDate: new Date("2025-06-11").toDateString() };
            const mockResult = [{ reservationID: 1, ...updateData }];
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce(mockResult),
                    }),
                }),
            });

            const result = await updateReservation(1, updateData);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("deleteReservation", () => {
        it("should delete a reservation and return true", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ reservationID: 1 }]),
                }),
            });

            const result = await deleteReservation(1);
            expect(result).toBe(true);
        });

        it("should return false if no reservation is deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const result = await deleteReservation(999);
            expect(result).toBe(false);
        });
    });
});
