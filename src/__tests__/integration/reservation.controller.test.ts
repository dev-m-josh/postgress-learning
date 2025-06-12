import request from "supertest";
import express from 'express';
import * as ReservationService from "../../reservation/reservation.service";

import {
    createReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation
} from '../../reservation/reservation.controller';

const app = express();
app.use(express.json());
app.get("/reservations", getAllReservations);
app.get("/reservations/:id", getReservationById as any);
app.post("/reservations", createReservation as any);
app.put("/reservations/:id", updateReservation as any);
app.delete("/reservations/:id", deleteReservation as any);

jest.mock("../../reservation/reservation.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

jest.spyOn(console, "error").mockImplementation(() => {});

describe("Reservation Controller", () => {
    test("should get all reservations", async () => {
        (ReservationService.getAllReservations as jest.Mock).mockResolvedValue([
            {
                reservationID: 1,
                customerID: 1,
                carID: 1,
                reservationDate: "2024-06-01",
                pickupDate: "2024-06-05",
                returnDate: "2024-06-10",
            },
            {
                reservationID: 4,
                customerID: 4,
                carID: 4,
                reservationDate: "2024-06-04",
                pickupDate: "2024-06-08",
                returnDate: "2024-06-13",
            },
        ]);
        const response = await request(app).get("/reservations");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                reservationID: 1,
                customerID: 1,
                carID: 1,
                reservationDate: "2024-06-01",
                pickupDate: "2024-06-05",
                returnDate: "2024-06-10",
            },
            {
                reservationID: 4,
                customerID: 4,
                carID: 4,
                reservationDate: "2024-06-04",
                pickupDate: "2024-06-08",
                returnDate: "2024-06-13",
            },
        ]);
    });

    test("should get a reservation by id", async () => {
        (ReservationService.getReservationById as jest.Mock).mockResolvedValue({
            reservationID: 1,
            customerID: 1,
            carID: 1,
            reservationDate: "2024-06-01",
            pickupDate: "2024-06-05",
            returnDate: "2024-06-10",
        });
        const response = await request(app).get("/reservations/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            reservationID: 1,
            customerID: 1,
            carID: 1,
            reservationDate: "2024-06-01",
            pickupDate: "2024-06-05",
            returnDate: "2024-06-10",
        });
    });

    test("should create a reservation", async () => {
        const newReservation = {
            customerID: 1,
            carID: 1,
            reservationDate: "2024-06-01",
            pickupDate: "2024-06-05",
            returnDate: "2024-06-10",
        };

        (ReservationService.createReservation as jest.Mock).mockResolvedValue({
            reservationID: 1,
            ...newReservation
        });

        const response = await request(app).post("/reservations").send(newReservation);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            reservationID: 1,
            ...newReservation
        });
    });

    test("should update a reservation", async () => {
        const updatedReservation = {
            customerID: 1,
            carID: 1,
            reservationDate: "2024-06-01",
            pickupDate: "2024-06-05",
            returnDate: "2024-06-10",
        };

        (ReservationService.updateReservation as jest.Mock).mockResolvedValue({
            reservationID: 1,
            ...updatedReservation
        });

        const response = await request(app).put("/reservations/1").send(updatedReservation);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            reservationID: 1,
            ...updatedReservation
        });
    });

    test("should delete a reservation", async () => {
        (ReservationService.deleteReservation as jest.Mock).mockResolvedValue(true);
        const response = await request(app).delete("/reservations/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Reservation deleted successfully" });
    });

    //testing if no reservation is found
    test("GET /cars/:id should return 404 if car not found", async () => {
        if ((ReservationService.getReservationById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/reservations/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Reservation not found" });
        }
        if ((ReservationService.updateReservation as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/reservations/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Reservation not found" });
        }
        if ((ReservationService.deleteReservation as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/reservations/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Reservation not found" });
        }
    });

    //testing if an error occured
    test("GET /reservations/:id should return 500 if an error occurs", async () => {
        if ((ReservationService.getAllReservations as jest.Mock).mockRejectedValue(new Error("Failed to fetch reservations"))) {
            const response = await request(app).get("/reservations");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch reservations" });

        }
        if ((ReservationService.getReservationById as jest.Mock).mockRejectedValue(new Error("Failed to fetch reservation"))) {
            const response = await request(app).get("/reservations/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch reservation" });
        }
        if ((ReservationService.createReservation as jest.Mock).mockRejectedValue(new Error("Failed to create reservation"))) {
            const response = await request(app).post("/reservations");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create reservation" });
        }
        if ((ReservationService.updateReservation as jest.Mock).mockRejectedValue(new Error("Failed to update reservation"))) {
            const response = await request(app).put("/reservations/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update reservation" });
        }
        if ((ReservationService.deleteReservation as jest.Mock).mockRejectedValue(new Error("Failed to delete reservation"))) {
            const response = await request(app).delete("/reservations/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete reservation" });
        }
    });
});
