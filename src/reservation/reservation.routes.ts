import { Express } from "express";
import * as ReservationController from "../reservation/reservation.controller";

const reservation = (app: Express) => {
    app.route("/reservations").get(async (req, res, next) => {
        try {
            await ReservationController.getAllReservations(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/reservations/:id").get(async (req, res, next) => {
        try {
            await ReservationController.getReservationById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/reservations/:id").put(async (req, res, next) => {
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

    app.route("/reservations").post(async (req, res, next) => {
        try {
            await ReservationController.createReservation(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default reservation;
