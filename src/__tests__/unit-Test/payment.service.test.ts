import {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
} from "../../payment/payment.service";
import { db } from "../../drizzle/db";
import { PaymentTable } from "../../drizzle/schema";
import payment from "../../payment/payment.routes";

jest.mock("../../drizzle/db", () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Payment Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllPayments", () => {
        it("should return all payments", async () => {
            const mockData = [{ paymentID: 1, amount: 1000 }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue(mockData),
            });

            const result = await getAllPayments();
            expect(result).toEqual(mockData);
        });
    });

    describe("getPaymentById", () => {
        it("should return payment by ID", async () => {
            const mockData = [{ paymentID: 1, amount: 1000 }];
            (db.select as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue(mockData),
                }),
            });

            const result = await getPaymentById(1);
            expect(result).toEqual(mockData[0]);
        });
    });

    describe("createPayment", () => {
        it("should create a new payment", async () => {
            const inputData = {
                amount: 1000.00 .toString(),
                paymentMethod: "Credit Card",
                paymentDate: new Date("2025-06-11").toDateString(),
                bookingID: 1,
            };

            const mockResult = [{ ...inputData, paymentID: 1 }];
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce(mockResult),
                }),
            });

            const result = await createPayment(inputData);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("updatePayment", () => {
        it("should update a payment", async () => {
            const updateData = { amount: 1500.00 .toString() };
            const mockResult = [{ paymentID: 1, ...updateData }];
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValueOnce(mockResult),
                    }),
                }),
            });

            const result = await updatePayment(1, updateData);
            expect(result).toEqual(mockResult[0]);
        });
    });

    describe("deletePayment", () => {
        it("should delete a payment and return true", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ paymentID: 1 }]),
                }),
            });

            const result = await deletePayment(1);
            expect(result).toBe(true);
        });

        it("should return false if no payment is deleted", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const result = await deletePayment(999);
            expect(result).toBe(false);
        });
    });
});
