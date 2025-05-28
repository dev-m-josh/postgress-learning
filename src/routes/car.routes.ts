
import { Router } from "express";
import { addCar, deleteCar, getAllCars, getCarById } from "../controllers/car.controller";

export const carRoutes = Router();

carRoutes.get("/", getAllCars);
carRoutes.get("/:id", getCarById);
carRoutes.post("/", addCar);
carRoutes.delete("/:id", deleteCar)