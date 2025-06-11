import request from "supertest";
import express from "express";
import * as MantainanceService from "../../mantainance/maintenance.service";

import {
    createMaintenance,
    getAllMaintenanceRecords,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
} from "../../mantainance/maintenance.controller";

// Step 1: Set up a minimal Express app for testing
const app = express();
app.use(express.json());
app.get("/maintenance", getAllMaintenanceRecords);
app.get("/maintenance/:id", getMaintenanceById as any);
app.post("/maintenance", createMaintenance as any);
app.put("/maintenance/:id", updateMaintenance as any);
app.delete("/maintenance/:id", deleteMaintenance as any);

// Step 2: Mock the car service
jest.mock("../../mantainance/maintenance.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

describe("Maintenance Controller", () => {
    //testing getting all maintenance records
    test("GET /maintenance should return all maintenance records", async () => {
        (MantainanceService.getAllMaintenanceRecords as jest.Mock).mockResolvedValue([
            {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: "2024-06-01",
                description: "Oil change and tire rotation",
                cost: 250.00,
            },
            {
                maintenanceID: 2,
                carID: 2,
                maintenanceDate: "2024-06-02",
                description: "Brake inspection and fluid top-up",
                cost: 300.00,
            },
        ]);
        const response = await request(app).get("/maintenance");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: "2024-06-01",
                description: "Oil change and tire rotation",
                cost: 250.0,
            },
            {
                maintenanceID: 2,
                carID: 2,
                maintenanceDate: "2024-06-02",
                description: "Brake inspection and fluid top-up",
                cost: 300.0,
            },
        ]);
    });

    //testing getting a single maintenance record
    test("GET /maintenance/:id should return a single maintenance record", async () => {
        (MantainanceService.getMaintenanceById as jest.Mock).mockResolvedValue({
            maintenanceID: 1,
            carID: 1,
            maintenanceDate: "2024-06-01",
            description: "Oil change and tire rotation",
            cost: 250.00,
        });
        const response = await request(app).get("/maintenance/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            maintenanceID: 1,
            carID: 1,
            maintenanceDate: "2024-06-01",
            description: "Oil change and tire rotation",
            cost: 250.0,
        });
    });

    //testing adding a new maintenance record
    test("POST /maintenance should create a new maintenance record", async () => {
        const newMaintenance = {
            carID: 1,
            maintenanceDate: "2024-06-01",
            description: "Oil change and tire rotation",
            cost: 250.00,
        };

        // Mock the service call
        (MantainanceService.createMaintenance as jest.Mock).mockResolvedValue({
            maintenanceID: 1,
            ...newMaintenance,
        });

        app.post("/maintenance", (req, res) => {
            return createMaintenance(req, res);
        });

        const res = await request(app).post("/maintenance").send(newMaintenance);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            maintenanceID: 1,
            ...newMaintenance,
        });
    });

    //testing updating a maintenance record
    test("PUT /maintenance/:id should update a maintenance record", async () => {
        const updatedMaintenance = {
            carID: 1,
            maintenanceDate: "2024-06-01",
            description: "Oil change and tire rotation",
            cost: 250.00,
        };

        // Mock the service call
        (MantainanceService.updateMaintenance as jest.Mock).mockResolvedValue({
            maintenanceID: 1,
            ...updatedMaintenance,
        });

        const res = await request(app).put("/maintenance/1").send(updatedMaintenance);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            maintenanceID: 1,
            ...updatedMaintenance,
        });
    });

    //testing deleting a maintenance record
    test("DELETE /maintenance/:id should delete a maintenance record", async () => {
        // Mock the deleteMaintenance service method
        (MantainanceService.deleteMaintenance as jest.Mock).mockResolvedValue(true);

        const res = await request(app).delete("/maintenance/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Maintenance record deleted successfully" });
    });

    //testing if no maintenance is found
    test("GET /maintenance/:id should return 404 if Maintenance not found", async () => {
        if ((MantainanceService.getMaintenanceById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/maintenance/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Maintenance record not found" });
        }
        if ((MantainanceService.updateMaintenance as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/maintenance/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Maintenance record not found" });
        }
        if ((MantainanceService.deleteMaintenance as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/maintenance/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Maintenance record not found" });
        }
    });

    //testing if an error occured
    test("GET /maintenance/:id should return 500 if an error occurs", async () => {
        if (
            (MantainanceService.getAllMaintenanceRecords as jest.Mock).mockRejectedValue(
                new Error("Failed to fetch maintenance records")
            )
        ) {
            const response = await request(app).get("/maintenance");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch maintenance records" });
        }
        if (
            (MantainanceService.getMaintenanceById as jest.Mock).mockRejectedValue(
                new Error("Failed to fetch maintenance record")
            )
        ) {
            const response = await request(app).get("/maintenance/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch maintenance record" });
        }
        if (
            (MantainanceService.createMaintenance as jest.Mock).mockRejectedValue(
                new Error("Failed to create maintenance record")
            )
        ) {
            const response = await request(app).post("/maintenance");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create maintenance record" });
        }
        if (
            (MantainanceService.updateMaintenance as jest.Mock).mockRejectedValue(
                new Error("Failed to update maintenance record")
            )
        ) {
            const response = await request(app).put("/maintenance/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update maintenance record" });
        }
        if (
            (MantainanceService.deleteMaintenance as jest.Mock).mockRejectedValue(
                new Error("Failed to delete maintenance record")
            )
        ) {
            const response = await request(app).delete("/maintenance/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete maintenance record" });
        }
    });
});