import request from "supertest";
import express from "express";
import * as CarService from "../car/car.service";
import { createCar, getAllCars, getCarById, updateCar, deleteCar } from "../car/car.controller";

// Step 1: Set up a minimal Express app for testing
const app = express();
app.use(express.json());
app.get("/cars", getAllCars);
app.get("/cars/:id", getCarById as any);
app.post("/cars", createCar as any);
app.put("/cars/:id", updateCar as any);
app.delete("/cars/:id", deleteCar as any);

// Step 2: Mock the car service
jest.mock("../car/car.service");

describe("Car Controller", () => {
    //testing getting all cars
    test("GET /cars should return all cars", async () => {
        (CarService.getAllCars as jest.Mock).mockResolvedValue([
            {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
        ]);

        const res = await request(app).get("/cars");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
            },
        ]);
    });

    //testing get car by id
    test("GET /cars/:id should return one car", async () => {
        (CarService.getCarById as jest.Mock).mockResolvedValue({
            carID: 1,
            carModel: "Toyota Corolla",
            year: "2020-01-01",
            color: "Red",
            rentalRate: "50.00",
            availability: true,
            locationID: 1,
        });

        const res = await request(app).get("/cars/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            carID: 1,
            carModel: "Toyota Corolla",
            year: "2020-01-01",
            color: "Red",
            rentalRate: "50.00",
            availability: true,
            locationID: 1,
        });
    });

    //testing if no car is found
    test("GET /cars/:id should return 404 if car not found", async () => {
        if ((CarService.getCarById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/cars/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Car not found" });
        }
        if ((CarService.updateCar as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/cars/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Car not found" });
        }
        if ((CarService.deleteCar as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/cars/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Car not found" });
        }
    });

    //testing if an error occured
    test("GET /cars/:id should return 500 if an error occurs", async () => {
        if ((CarService.getAllCars as jest.Mock).mockRejectedValue(new Error("Failed to fetch car"))) {
            const response = await request(app).get("/cars");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch cars" });

        }
        if ((CarService.getCarById as jest.Mock).mockRejectedValue(new Error("Failed to fetch car"))) {
            const response = await request(app).get("/cars/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch car" });
        }
        if((CarService.createCar as jest.Mock).mockRejectedValue(new Error("Failed to create car"))){
            const response = await request(app).post("/cars");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create car" });
        }
        if((CarService.updateCar as jest.Mock).mockRejectedValue(new Error("Failed to update car"))){
            const response = await request(app).put("/cars/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update car" });
        }
        if((CarService.deleteCar as jest.Mock).mockRejectedValue(new Error("Failed to delete car"))){
            const response = await request(app).delete("/cars/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete car" });
        }
    });

    //testing adding a new car
    test("POST /cars should create a new car", async () => {
        const newCar = {
            carModel: "Subaru Outback",
            year: "2022-05-01",
            color: "Blue",
            rentalRate: "65.00",
            availability: true,
            locationID: 3,
        };

        // Mock the service call
        (CarService.createCar as jest.Mock).mockResolvedValue({
            carID: 10,
            ...newCar,
        });

        app.post("/cars", (req, res) => {
            return createCar(req, res);
        });

        const res = await request(app).post("/cars").send(newCar);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            carID: 10,
            ...newCar,
        });
    });

    //testing updating a car information
    test("PUT /cars/:id should update an existing car", async () => {
        const updatedCar = {
            carModel: "Subaru Outback",
            year: "2022-05-01",
            color: "Black",
            rentalRate: "70.00",
            availability: false,
            locationID: 3,
        };

        // Mock the service method
        (CarService.updateCar as jest.Mock).mockResolvedValue({
            carID: 10,
            ...updatedCar,
        });

        const res = await request(app).put("/cars/1").send(updatedCar);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            carID: 10,
            ...updatedCar,
        });
    });

    //testing deleting a car
    test("DELETE /cars/:id should delete a car", async () => {
        // Mock the deleteCar service method
        (CarService.deleteCar as jest.Mock).mockResolvedValue(true);

        const res = await request(app).delete("/cars/10");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Car deleted successfully" });
    });

    // testing failed deletion
    test("DELETE /cars/:id should return 404 if car not found", async () => {
        // failed deletion
        (CarService.deleteCar as jest.Mock).mockResolvedValue(false);

        const res = await request(app).delete("/cars/999");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Car not found" });
    });
});
