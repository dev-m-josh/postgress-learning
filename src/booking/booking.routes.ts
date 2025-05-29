import { Express } from "express";
import * as BookingController from "../booking/booking.controller";

const booking = (app: Express) => {
    app.route("/bookings").get(async (req, res, next) => {
        try {
            await BookingController.getAllBookings(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/:id").get(async (req, res, next) => {
        try {
            await BookingController.getBookingById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings").post(async (req, res, next) => {
        try {
            await BookingController.createBooking(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/:id").put(async (req, res, next) => {
        try {
            await BookingController.updateBooking(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/:id").delete(async (req, res, next) => {
        try {
            await BookingController.deleteBooking(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default booking;
