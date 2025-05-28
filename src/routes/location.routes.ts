import { Router } from "express";
import {
    getAllLocations,
    getLocationById,
    addLocation,
    deleteLocation,
    updateLocation,
} from "../controllers/location.controller";

export const locationRoutes = Router();

locationRoutes.get("/", getAllLocations);
locationRoutes.get("/:id", getLocationById);
locationRoutes.post("/", addLocation);
locationRoutes.delete("/:id", deleteLocation);
locationRoutes.put("/:id", updateLocation);
