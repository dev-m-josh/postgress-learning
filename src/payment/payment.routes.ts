import { Express } from "express";
import * as PaymentController from "./payment.controller";

const payment = (app: Express) => {
    app.route("/payments").get(async (req, res, next) => {
        try {
            await PaymentController.getAllPayments(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/payments/:id").get(async (req, res, next) => {
        try {
            await PaymentController.getPaymentById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/payments").post(async (req, res, next) => {
        try {
            await PaymentController.createPayment(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/payments/:id").put(async (req, res, next) => {
        try {
            await PaymentController.updatePayment(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/payments/:id").delete(async (req, res, next) => {
        try {
            await PaymentController.deletePayment(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default payment;
