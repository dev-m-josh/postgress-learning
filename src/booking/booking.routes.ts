import { Express } from "express";
import * as BookingController from "../booking/booking.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const booking = (app: Express) => {
    app.route("/bookings").get(async (req, res, next) => {
        try {
            await BookingController.getAllBookings(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/:id").get(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await BookingController.getBookingById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings").post(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await BookingController.createBooking(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/:id").put(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await BookingController.updateBooking(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/:id").delete(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await BookingController.deleteBooking(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/details/:id").get(async (req, res, next) => {
        try {
            await BookingController.getBookingDetailsById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/bookings/payments/:id").get(async (req, res, next) => {
        try {
            await BookingController.getBookingPaymentById(req, res)
        } catch (error) {
            next(error)
        }
    })
};



export default booking;
