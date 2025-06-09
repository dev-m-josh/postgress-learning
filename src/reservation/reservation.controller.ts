import { Request, Response } from "express";
import * as ReservationService from "../reservation/reservation.service";

export const getAllReservations = async (_req: Request, res: Response) => {
    try {
        const reservations = await ReservationService.getAllReservations();
        res.json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};

export const getReservationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const reservation = await ReservationService.getReservationById(Number(id));
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json(reservation);
    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ error: "Failed to fetch reservation" });
    }
};

export const createReservation = async (req: Request, res: Response) => {
    try {
        const newReservation = await ReservationService.createReservation(req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Failed to create reservation" });
    }
};

export const updateReservation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await ReservationService.updateReservation(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json(updated);
    } catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).json({ error: "Failed to update reservation" });
    }
};

export const deleteReservation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await ReservationService.deleteReservation(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).json({ error: "Failed to delete reservation" });
    }
};
