import  request from 'supertest';
import express from 'express';
import * as PaymentService from "../../payment/payment.service";
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} from "../../payment/payment.controller";

const app = express();
app.use(express.json());
app.get("/payments", getAllPayments);
app.get("/payments/:id", getPaymentById as any);
app.post("/payments", createPayment as any);
app.put("/payments/:id", updatePayment as any);
app.delete("/payments/:id", deletePayment as any);

jest.mock("../../payment/payment.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

describe("Payment Controller", () => {
    test("should get all payments", async () => {
        (PaymentService.getAllPayments as jest.Mock).mockResolvedValue([
            {
                paymentID: 1,
                bookingID: 1,
                paymentDate: "2024-06-05",
                amount: "250.00",
                paymentMethod: "Credit Card",
            },
            {
                paymentID: 4,
                bookingID: 4,
                paymentDate: "2024-06-08",
                amount: "325.00",
                paymentMethod: "Credit Card",
            },
        ]);
        const response = await request(app).get("/payments");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                paymentID: 1,
                bookingID: 1,
                paymentDate: "2024-06-05",
                amount: "250.00",
                paymentMethod: "Credit Card",
            },
            {
                paymentID: 4,
                bookingID: 4,
                paymentDate: "2024-06-08",
                amount: "325.00",
                paymentMethod: "Credit Card",
            },
        ]);
    });

    test("should get a payment by id", async () => {
        (PaymentService.getPaymentById as jest.Mock).mockResolvedValue({
            paymentID: 1,
            bookingID: 1,
            paymentDate: "2024-06-05",
            amount: "250.00",
            paymentMethod: "Credit Card",
        });
        const response = await request(app).get("/payments/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            paymentID: 1,
            bookingID: 1,
            paymentDate: "2024-06-05",
            amount: "250.00",
            paymentMethod: "Credit Card",
        });
    });

    test("should create a payment", async () => {
        const payment = {
            bookingID: 1,
            paymentDate: "2024-06-05",
            amount: "250.00",
            paymentMethod: "Credit Card",
        };
        (PaymentService.createPayment as jest.Mock).mockResolvedValue({
            paymentID: 1,
            ...payment,
        });
        const response = await request(app).post("/payments").send(payment);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            paymentID: 1,
            ...payment,
        });
    });

    test("should update a payment", async () => {
        const payment = {
            bookingID: 1,
            paymentDate: "2024-06-05",
            amount: "250.00",
            paymentMethod: "Credit Card",
        };
        (PaymentService.updatePayment as jest.Mock).mockResolvedValue({
            paymentID: 1,
            ...payment,
        });
        const response = await request(app).put("/payments/1").send(payment);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            paymentID: 1,
            ...payment,
        });
    });

    test("should delete a payment", async () => {
        (PaymentService.deletePayment as jest.Mock).mockResolvedValue(true);
        const response = await request(app).delete("/payments/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Payment deleted successfully" });
    });

    //testing if no payment is found
    test("GET /payment/:id should return 404 if payment not found", async () => {
        if ((PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/payments/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Payment not found" });
        }
        if ((PaymentService.updatePayment as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/payments/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Payment not found" });
        }
        if ((PaymentService.deletePayment as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/payments/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Payment not found" });
        }
    });

    //testing if an error occured
    test("GET /payments/:id should return 500 if an error occurs", async () => {
        if ((PaymentService.getAllPayments as jest.Mock).mockRejectedValue(new Error("Failed to fetch car"))) {
            const response = await request(app).get("/payments");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch payments" });

        }
        if ((PaymentService.getPaymentById as jest.Mock).mockRejectedValue(new Error("Failed to fetch payments"))) {
            const response = await request(app).get("/payments/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch payment" });
        }
        if ((PaymentService.createPayment as jest.Mock).mockRejectedValue(new Error("Failed to create payment"))) {
            const response = await request(app).post("/payments");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create payment" });
        }
        if ((PaymentService.updatePayment as jest.Mock).mockRejectedValue(new Error("Failed to update payment"))) {
            const response = await request(app).put("/payments/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update payment" });
        }
        if ((PaymentService.deletePayment as jest.Mock).mockRejectedValue(new Error("Failed to delete payment"))) {
            const response = await request(app).delete("/payments/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete payment" });
        }
    });
});