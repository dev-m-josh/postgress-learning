//mantainance route
import { Express } from "express";
import * as MaintenanceController from "./maintenance.controller";
const maintenanceRoutes = (app: Express) => {
    app.route("/maintenance").get(async (req, res, next) => {
        try {
            await MaintenanceController.getAllMaintenanceRecords(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/maintenance/:id").get(async (req, res, next) => {
        try {
            await MaintenanceController.getMaintenanceById(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/maintenance").post(async (req, res, next) => {
        try {
            await MaintenanceController.createMaintenance(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/maintenance/:id").put(async (req, res, next) => {
        try {
            await MaintenanceController.updateMaintenance(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/maintenance/:id").delete(async (req, res, next) => {
        try {
            await MaintenanceController.deleteMaintenance(req, res);
        } catch (error) {
            next(error);
        }
    });
};
export default maintenanceRoutes;