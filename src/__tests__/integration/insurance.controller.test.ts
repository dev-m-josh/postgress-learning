import request from "supertest";
import express from 'express';
import * as InsuranceService from "../../insurance/insurance.service";
import {
    getAllInsuranceRecords,
    getInsuranceById,
    createInsurance,
    updateInsurance,
    deleteInsurance
} from "../../insurance/insurance.controller";
import insurance from "../../insurance/insurance.routes";

const app = express();
app.use(express.json());
app.get("/insurance", getAllInsuranceRecords);
app.get("/insurance/:id", getInsuranceById as any);
app.post("/insurance", createInsurance as any);
app.put("/insurance/:id", updateInsurance as any);
app.delete("/insurance/:id", deleteInsurance as any);

jest.mock("../../insurance/insurance.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

jest.spyOn(console, "error").mockImplementation(() => {});

describe("Insurance Controller", () => {
    it("should fetch all insurance records", async () => {
        (InsuranceService.getAllInsuranceRecords as jest.Mock).mockResolvedValue([
            {
                insuranceID: 1,
                carID: 1,
                insuranceProvider: "ABC Insurance",
                policyNumber: "12345",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            },
            {
                insuranceID: 2,
                carID: 2,
                insuranceProvider: "XYZ Insurance",
                policyNumber: "54321",
                startDate: "2024-02-01",
                endDate: "2025-01-31",
            },
        ]);
        const response = await request(app).get("/insurance");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                insuranceID: 1,
                carID: 1,
                insuranceProvider: "ABC Insurance",
                policyNumber: "12345",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            },
            {
                insuranceID: 2,
                carID: 2,
                insuranceProvider: "XYZ Insurance",
                policyNumber: "54321",
                startDate: "2024-02-01",
                endDate: "2025-01-31",
            },
        ]);
    });

    it("should fetch an insurance record by ID", async () => {
        (InsuranceService.getInsuranceById as jest.Mock).mockResolvedValue({
            insuranceID: 1,
            carID: 1,
            insuranceProvider: "ABC Insurance",
            policyNumber: "12345",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
        });
        const response = await request(app).get("/insurance/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            insuranceID: 1,
            carID: 1,
            insuranceProvider: "ABC Insurance",
            policyNumber: "12345",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
        });
    });

    //testing creating an insurance record
    it("should create an insurance record", async () => {
        const newInsurance = {
            carID: 1,
            insuranceProvider: "ABC Insurance",
            policyNumber: "12345",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
        };
        (InsuranceService.createInsurance as jest.Mock).mockResolvedValue({
            insuranceID: 1,
            ...newInsurance
        });
        const response = await request(app).post("/insurance").send(newInsurance);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            insuranceID: 1,
            ...newInsurance
        });
    });

    //testing updating insurance
    it("should update an insurance record", async () => {
        const updatedInsurance = {
            insuranceID: 1,
            carID: 1,
            insuranceProvider: "XYZ Insurance",
            policyNumber: "54321",
            startDate: "2024-02-01",
            endDate: "2025-01-31",
        };
        (InsuranceService.updateInsurance as jest.Mock).mockResolvedValue(updatedInsurance);
        const response = await request(app).put("/insurance/1").send(updatedInsurance);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedInsurance);
    });

    //testing deleting an insurance record
    it("should delete an insurance record", async () => {
        (InsuranceService.deleteInsurance as jest.Mock).mockResolvedValue(true);
        const response = await request(app).delete("/insurance/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Insurance record deleted successfully" });
    });

    //testing if no insurance is found
    test("GET /insurance/:id should return 404 if insurance not found", async () => {
        if ((InsuranceService.getInsuranceById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/insurance/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Insurance record not found" });
        }
        if ((InsuranceService.updateInsurance as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/insurance/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Insurance record not found" });
        }
        if ((InsuranceService.deleteInsurance as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/insurance/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Insurance record not found" });
        }
    });

    //testing if an error occured
    test("GET /insurance/:id should return 500 if an error occurs", async () => {
        if (
            (InsuranceService.getAllInsuranceRecords as jest.Mock).mockRejectedValue(
                new Error("Failed to fetch insurance records")
            )
        ) {
            const response = await request(app).get("/insurance");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch insurance records" });
        }
        if (
            (InsuranceService.getInsuranceById as jest.Mock).mockRejectedValue(new Error("Failed to fetch insurance record"))
        ) {
            const response = await request(app).get("/insurance/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch insurance record" });
        }
        if (
            (InsuranceService.createInsurance as jest.Mock).mockRejectedValue(new Error("Failed to create insurance record"))
        ) {
            const response = await request(app).post("/insurance");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create insurance record" });
        }
        if (
            (InsuranceService.updateInsurance as jest.Mock).mockRejectedValue(new Error("Failed to update insurance record"))
        ) {
            const response = await request(app).put("/insurance/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update insurance record" });
        }
        if (
            (InsuranceService.deleteInsurance as jest.Mock).mockRejectedValue(new Error("Failed to delete insurance record"))
        ) {
            const response = await request(app).delete("/insurance/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete insurance record" });
        }
    });
});