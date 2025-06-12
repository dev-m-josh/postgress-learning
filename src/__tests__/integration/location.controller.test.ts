import request from "supertest";
import express from "express";
import * as LocationService from "../../location/location.service";

import {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
    getLocationDetails
} from "../../location/location.controller";

// import app from "../../../src/server"

const app = express();
app.use(express.json());
app.get("/locations", getAllLocations);
app.get("/locations/:id", getLocationById as any);
app.post("/locations", createLocation as any);
app.put("/locations/:id", updateLocation as any);
app.delete("/locations/:id", deleteLocation as any);
app.get("/location/:id/cars", getLocationDetails as any);

jest.mock("../../location/location.service");

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.spyOn(console, "error").mockImplementation(() => {});

afterAll(() => {
    jest.restoreAllMocks();
});


describe("Location Controller", () => {
    test("GET /locations should return all locations", async () => {
        (LocationService.getAllLocations as jest.Mock).mockResolvedValue([
            {
                locationID: 1,
                locationName: "Nairobi",
                address: "123 Nairobi",
                contactNumber: "1234567890",
            },
            {
                locationID: 2,
                locationName: "Eldoret",
                address: "Eldoret",
                contactNumber: "0987654321",
            },
        ]);
        const response = await request(app).get("/locations");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                locationID: 1,
                locationName: "Nairobi",
                address: "123 Nairobi",
                contactNumber: "1234567890",
            },
            {
                locationID: 2,
                locationName: "Eldoret",
                address: "Eldoret",
                contactNumber: "0987654321",
            },
        ]);
    });

    test("GET /locations/:id should return location by id", async () => {
        (LocationService.getLocationById as jest.Mock).mockResolvedValue({
            locationID: 1,
            locationName: "Nairobi",
            address: "123 Nairobi",
            contactNumber: "1234567890",
        });
        const response = await request(app).get("/locations/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            locationID: 1,
            locationName: "Nairobi",
            address: "123 Nairobi",
            contactNumber: "1234567890",
        });
    });

    test("POST /locations should create a new location", async () => {
        const newLocation = {
            locationName: "Nairobi",
            address: "123 Nairobi",
            contactNumber: "1234567890",
        };
        (LocationService.createLocation as jest.Mock).mockResolvedValue({
            locationID: 1,
            ...newLocation
        });
        const response = await request(app).post("/locations").send(newLocation);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            locationID: 1,
            ...newLocation
        })
    });

    test("PUT /locations/:id should update a location", async () => {
        const updatedLocation = {
            locationName: "Nairobi",
            address: "123 Nairobi",
            contactNumber: "1234567890",
        };
        (LocationService.updateLocation as jest.Mock).mockResolvedValue({
            locationID: 1,
            ...updatedLocation
        });
        const response = await request(app).put("/locations/1").send(updatedLocation);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            locationID: 1,
            ...updatedLocation
        });
    });

    test("DELETE /locations/:id should delete a location", async () => {
        (LocationService.deleteLocation as jest.Mock).mockResolvedValue(true);
        const response = await request(app).delete("/locations/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Location deleted successfully" });
    });

    test("GET /location/:id/cars should return all cars in a location", async () => {
        (LocationService.getLocationWithCars as jest.Mock).mockResolvedValue({
            location: {
                locationID: 1,
                locationName: "Nairobi",
                address: "123 Nairobi",
                contactNumber: "1234567890",
            },
            cars: [
                {
                    carID: 1,
                    carModel: "Toyota Corolla",
                    year: "2020-01-01",
                    color: "Red",
                    rentalRate: "50.00",
                    availability: true,
                    locationID: 1,
                },
            ],
        });
        const response = await request(app).get("/location/1/cars");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            location: {
                locationID: 1,
                locationName: "Nairobi",
                address: "123 Nairobi",
                contactNumber: "1234567890",
            },
            cars: [
                {
                    carID: 1,
                    carModel: "Toyota Corolla",
                    year: "2020-01-01",
                    color: "Red",
                    rentalRate: "50.00",
                    availability: true,
                    locationID: 1,
                },
            ],
        });
    });

    //testing if no location is found
    test("GET /cars/:id should return 404 if car not found", async () => {
        if ((LocationService.getLocationById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/locations/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Location not found" });
        }
        if ((LocationService.updateLocation as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/locations/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Location not found" });
        }
        if ((LocationService.deleteLocation as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/locations/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Location not found" });
        }
        if ((LocationService.getLocationWithCars as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/location/:id/cars");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Location not found" });
        }
    });

    //testing if an error occured
    test("GET /locations/:id should return 500 if an error occurs", async () => {
        if ((LocationService.getAllLocations as jest.Mock).mockRejectedValue(new Error("Failed to fetch locations"))) {
            const response = await request(app).get("/locations");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch locations" });
        }
        if ((LocationService.getLocationById as jest.Mock).mockRejectedValue(new Error("Failed to fetch location"))) {
            const response = await request(app).get("/locations/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch location" });
        }
        if ((LocationService.createLocation as jest.Mock).mockRejectedValue(new Error("Failed to create location"))) {
            const response = await request(app).post("/locations");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create location" });
        }
        if ((LocationService.updateLocation as jest.Mock).mockRejectedValue(new Error("Failed to update location"))) {
            const response = await request(app).put("/locations/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update location" });
        }
        if ((LocationService.deleteLocation as jest.Mock).mockRejectedValue(new Error("Failed to delete location"))) {
            const response = await request(app).delete("/locations/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete location" });
        }
        if ((LocationService.getLocationWithCars as jest.Mock).mockRejectedValue(new Error("Failed to fetch location details"))) {
            const response = await request(app).get("/location/:id/cars");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch location details" });
        }
    });
});