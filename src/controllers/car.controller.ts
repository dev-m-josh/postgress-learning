// src/controllers/car.controller.ts
import { Request, Response } from "express";
import { CarService } from "../services/car.service";

export const getAllCars = async (req: Request, res: Response) => {
    const cars = await CarService.getAllCars();
    res.json(cars);
};

export const getCarById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid car ID" });

    const car = await CarService.getCarById(id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    res.json(car);
};

export const addCar = async (req: Request, res: Response) => {
    const newCar = req.body;
    try {
        const createdCar = await CarService.addCar(newCar);
        res.status(201).json(createdCar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add car" });
    }
};

export const deleteCar = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid car ID" });
    }

    const deletedCar = await CarService.deleteCar(id);
    if (!deletedCar) {
        return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "Car deleted successfully", car: deletedCar });
};