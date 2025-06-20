import { Express } from "express";
import * as CarController from "./car.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const car = (app: Express) => {
    app.route("/cars").get(async (req, res, next) => {
        try {
            await CarController.getAllCars(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/cars/:id").get(async (req, res, next) => {
        try {
            await CarController.getCarById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/cars").post(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await CarController.createCar(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/cars/:id").put(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await CarController.updateCar(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/cars/:id").delete(authenticateToken as any, requireAdmin as any, async (req, res, next) => {
        try {
            await CarController.deleteCar(req, res);
        } catch (error) {
            next(error);
        }
    });

};

export default car;
