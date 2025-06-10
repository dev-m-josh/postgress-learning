import { Request, Response } from "express";
import * as BookingService from "../booking/booking.service";
import { BookingsTable, CustomerTable, CarTable, LocationTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/node-postgres';

export const getAllBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await BookingService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        console.log("Error fetching bookings:",error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const booking = await BookingService.getBookingById(Number(id));
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch booking" });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const newBooking = await BookingService.createBooking(req.body);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: "Failed to create booking" });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await BookingService.updateBooking(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update booking" });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await BookingService.deleteBooking(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete booking" });
    }
};

export const getBookingDetailsById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const bookingDetails = await BookingService.getBookingDetailsById(Number(id));
        if (!bookingDetails) {
            return res.status(404).json({ error: "Booking details not found" });
        }
        res.json(bookingDetails);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch booking details" });
    }
};

export const getBookingPaymentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const bookingDetails = await BookingService.getBookingWithPayment(Number(id));
        if (!bookingDetails) {
            return res.status(404).json({ error: "Booking details not found" });
        }
        res.json(bookingDetails);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch booking details" });
    }
};
