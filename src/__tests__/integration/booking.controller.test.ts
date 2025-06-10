import request from "supertest";
import express from "express";
import * as BookingService from "../../booking/booking.service";
import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingDetailsById,
    getBookingPaymentById
} from "../../booking/booking.controller";

const app = express();
app.use(express.json());
app.get("/bookings", getAllBookings);
app.get("/bookings/:id", getBookingById as any);
app.post("/bookings", createBooking as any);
app.put("/bookings/:id", updateBooking as any);
app.delete("/bookings/:id", deleteBooking as any);
app.get("/bookings/payments/:id", getBookingPaymentById as any);
app.get("/bookings/details/:id", getBookingDetailsById as any);

jest.mock("../../booking/booking.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

describe("Booking Controller", () => {
    test("GET /bookings should return all bookings", async () => {
        (BookingService.getAllBookings as jest.Mock).mockResolvedValue([
            {
                bookingID: 1,
                carID: 1,
                customerID: 1,
                rentalStartDate: "2023-01-01",
                rentalEndDate: "2023-01-10",
                totalAmount: "1000.00",
            },
        ]);

        const response = await request(app).get("/bookings");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                bookingID: 1,
                carID: 1,
                customerID: 1,
                rentalStartDate: "2023-01-01",
                rentalEndDate: "2023-01-10",
                totalAmount: "1000.00",
            },
        ]);
    });

    //testing getting a single booking
    test("GET /bookings/:id should return a single booking", async () => {
        (BookingService.getBookingById as jest.Mock).mockResolvedValue({
            bookingID: 1,
            carID: 1,
            customerID: 1,
            rentalStartDate: "2023-01-01",
            rentalEndDate: "2023-01-10",
            totalAmount: "1000.00",
        });
        const response = await request(app).get("/bookings/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bookingID: 1,
            carID: 1,
            customerID: 1,
            rentalStartDate: "2023-01-01",
            rentalEndDate: "2023-01-10",
            totalAmount: "1000.00",
        });
    });

    //testing adding a new booking
    test("POST /bookings should create a new booking", async () => {
        const newBooking = {
            carID: 1,
            customerID: 1,
            rentalStartDate: "2023-01-01",
            rentalEndDate: "2023-01-10",
            totalAmount: "1000.00",
        };
        (BookingService.createBooking as jest.Mock).mockResolvedValue({
            bookingID: 1,
            ...newBooking,
        });

        app.post("/bookings", (req, res) => {
            return createBooking(req, res);
        });

        const response = await request(app).post("/bookings").send(newBooking);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            bookingID: 1,
            ...newBooking,
        });
    });

    //testing updating a booking information
    test("PUT /bookings/:id should update a booking", async () => {
        const updatedBooking = {
            carID: 1,
            customerID: 1,
            rentalStartDate: "2023-01-01",
            rentalEndDate: "2023-01-10",
            totalAmount: "1000.00",
        };
        (BookingService.updateBooking as jest.Mock).mockResolvedValue({
            bookingID: 1,
            ...updatedBooking,
        });

        const response = await request(app).put("/bookings/1").send(updatedBooking);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bookingID: 1,
            ...updatedBooking,
        });
    });

    //testing deleting a booking
    test("DELETE /bookings/:id should delete a booking", async () => {
        (BookingService.deleteBooking as jest.Mock).mockResolvedValue(true);
        const response = await request(app).delete("/bookings/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Booking deleted successfully" });
    });

    //testing booking payments
    test("GET /bookings/payments/:id should return booking details", async () => {
        (BookingService.getBookingWithPayment as jest.Mock).mockResolvedValue({
            booking: {
                bookingID: 1,
                carID: 1,
                customerID: 1,
                rentalStartDate: "2024-06-05",
                rentalEndDate: "2024-06-10",
                totalAmount: "250.00",
            },
            customer: {
                customerID: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "",
                phoneNumber: "555-1234",
                address: "1 Elm St",
                isAdmin: false,
                verificationCode: null,
                isVerified: false,
            },
            car: {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
            payment: {
                paymentID: 1,
                bookingID: 1,
                paymentDate: "2024-06-05",
                amount: "250.00",
                paymentMethod: "Credit Card",
            },
        });
        const response = await request(app).get("/bookings/payments/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            booking: {
                bookingID: 1,
                carID: 1,
                customerID: 1,
                rentalStartDate: "2024-06-05",
                rentalEndDate: "2024-06-10",
                totalAmount: "250.00",
            },
            customer: {
                customerID: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "",
                phoneNumber: "555-1234",
                address: "1 Elm St",
                isAdmin: false,
                verificationCode: null,
                isVerified: false,
            },
            car: {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
            payment: {
                paymentID: 1,
                bookingID: 1,
                paymentDate: "2024-06-05",
                amount: "250.00",
                paymentMethod: "Credit Card",
            },
        });
    });

    //testing booking with details
    test("GET /bookings/:id should return booking details", async () => {
        (BookingService.getBookingDetailsById as jest.Mock).mockResolvedValue({
            booking: {
                bookingID: 1,
                carID: 1,
                customerID: 1,
                rentalStartDate: "2024-06-05",
                rentalEndDate: "2024-06-10",
                totalAmount: "250.00",
            },
            customer: {
                customerID: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "",
                phoneNumber: "555-1234",
                address: "1 Elm St",
                isAdmin: false,
                verificationCode: null,
                isVerified: false,
            },
            car: {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
            location: {
                locationID: 1,
                locationName: "Nairobi",
                address: "123 Nairobi",
                contactNumber: "1234567890",
            },
        });
        const response = await request(app).get("/bookings/details/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            booking: {
                bookingID: 1,
                carID: 1,
                customerID: 1,
                rentalStartDate: "2024-06-05",
                rentalEndDate: "2024-06-10",
                totalAmount: "250.00",
            },
            customer: {
                customerID: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "",
                phoneNumber: "555-1234",
                address: "1 Elm St",
                isAdmin: false,
                verificationCode: null,
                isVerified: false,
            },
            car: {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
            location: {
                locationID: 1,
                locationName: "Nairobi",
                address: "123 Nairobi",
                contactNumber: "1234567890",
            },
        });
    });

    //testing if no booking is found
    test("GET /bookings/:id should return 404 if booking not found", async () => {
        if ((BookingService.getBookingById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/bookings/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Booking not found" });
        }
        if ((BookingService.updateBooking as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/bookings/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Booking not found" });
        }
        if ((BookingService.deleteBooking as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/bookings/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Booking not found" });
        }
        if ((BookingService.getBookingWithPayment as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/bookings/payments/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Booking details not found" });
        }
        if ((BookingService.getBookingDetailsById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/bookings/details/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Booking details not found" });
        }
    });

    //testing if an error occured
    test("GET /bookings/:id should return 500 if an error occurs", async () => {
        if ((BookingService.getAllBookings as jest.Mock).mockRejectedValue(new Error("Failed to fetch bookings"))) {
            const response = await request(app).get("/bookings");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch bookings" });
        }
        if ((BookingService.getBookingById as jest.Mock).mockRejectedValue(new Error("Failed to fetch booking"))) {
            const response = await request(app).get("/bookings/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch booking" });
        }
        if ((BookingService.createBooking as jest.Mock).mockRejectedValue(new Error("Failed to create booking"))) {
            const response = await request(app).post("/bookings");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create booking" });
        }
        if ((BookingService.updateBooking as jest.Mock).mockRejectedValue(new Error("Failed to update booking"))) {
            const response = await request(app).put("/bookings/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update booking" });
        }
        if ((BookingService.deleteBooking as jest.Mock).mockRejectedValue(new Error("Failed to delete booking"))) {
            const response = await request(app).delete("/bookings/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete booking" });
        }
        if (
            (BookingService.getBookingWithPayment as jest.Mock).mockRejectedValue(
                new Error("Failed to fetch booking details")
            )
        ) {
            const response = await request(app).get("/bookings/payments/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch booking details" });
        }
        if (
            (BookingService.getBookingDetailsById as jest.Mock).mockRejectedValue(
                new Error("Failed to fetch booking details")
            )
        ) {
            const response = await request(app).get("/bookings/details/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch booking details" });
        }
    });
});
