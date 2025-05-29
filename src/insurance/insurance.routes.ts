import { Express } from "express";
import * as InsuranceController from "./insurance.controller";

const insurance = (app: Express) => {
    app.route("/insurance").get(async (req, res, next) => {
        try {
            await InsuranceController.getAllInsuranceRecords(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/insurance/:id").get(async (req, res, next) => {
        try {
            await InsuranceController.getInsuranceById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/insurance").post(async (req, res, next) => {
        try {
            await InsuranceController.createInsurance(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/insurance/:id").put(async (req, res, next) => {
        try {
            await InsuranceController.updateInsurance(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/insurance/:id").delete(async (req, res, next) => {
        try {
            await InsuranceController.deleteInsurance(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default insurance;
