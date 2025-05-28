import { Router } from "express";
import { getAllCars, getCarById, addCar, deleteCar, updateCar } from "../controllers/car.controller";

export const carRoutes = Router();

carRoutes.get("/", getAllCars);
carRoutes.get("/:id", getCarById);
carRoutes.post("/", addCar);
carRoutes.delete("/:id", deleteCar);
carRoutes.put("/:id", updateCar);
