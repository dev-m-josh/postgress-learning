import { Express } from "express";
import * as LocationController from "./location.controller";

const locationRoutes = (app: Express) => {
    app.route("/locations").get(async (req, res, next) => {
        try {
            await LocationController.getAllLocations(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/locations/:id").get(async (req, res, next) => {
        try {
            await LocationController.getLocationById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/locations").post(async (req, res, next) => {
        try {
            await LocationController.createLocation(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/locations/:id").put(async (req, res, next) => {
        try {
            await LocationController.updateLocation(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/locations/:id").delete(async (req, res, next) => {
        try {
            await LocationController.deleteLocation(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default locationRoutes;
