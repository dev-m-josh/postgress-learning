import { Express } from "express";
import * as ReservationController from "../reservation/reservation.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const reservation = (app: Express) => {
    app.route("/reservations").get(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await ReservationController.getAllReservations(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/reservations/:id").get(authenticateToken as any, async (req, res, next) => {
        try {
            await ReservationController.getReservationById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/reservations/:id").put(authenticateToken as any, async (req, res, next) => {
        try {
            await ReservationController.updateReservation(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/reservations/:id").delete(async (req, res, next) => {
        try {
            await ReservationController.deleteReservation(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/reservations").post(authenticateToken as any, async (req, res, next) => {
        try {
            await ReservationController.createReservation(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default reservation;
