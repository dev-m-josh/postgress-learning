import { Request, Response } from "express";
import * as CarService from "./car.service";

export const getAllCars = async (_req: Request, res: Response) => {
    try {
        const cars = await CarService.getAllCars();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
};

export const getCarById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const car = await CarService.getCarById(Number(id));
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch car" });
    }
};

export const createCar = async (req: Request, res: Response) => {
    try {
        const newCar = await CarService.createCar(req.body);
        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: "Failed to create car" });
    }
};

export const updateCar = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await CarService.updateCar(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update car" });
    }
};

export const deleteCar = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await CarService.deleteCar(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete car" });
    }
};
