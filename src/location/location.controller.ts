import { Request, Response } from "express";
import * as LocationService from "./location.service";

export const getAllLocations = async (_req: Request, res: Response) => {
    try {
        const locations = await LocationService.getAllLocations();
        res.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Failed to fetch locations" });
    }
};

export const getLocationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const location = await LocationService.getLocationById(Number(id));
        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.json(location);
    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ error: "Failed to fetch location" });
    }
};

export const createLocation = async (req: Request, res: Response) => {
    try {
        const newLocation = await LocationService.createLocation(req.body);
        res.status(201).json(newLocation);
    } catch (error) {
        console.error("Error creating location:", error);
        res.status(500).json({ error: "Failed to create location" });
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await LocationService.updateLocation(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.json(updated);
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ error: "Failed to update location" });
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await LocationService.deleteLocation(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.json({ message: "Location deleted successfully" });
    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).json({ error: "Failed to delete location" });
    }
};

export const getLocationDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const locationData = await LocationService.getLocationWithCars(Number(id));
        if (!locationData) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.json(locationData);
    } catch (error) {
        console.error("Error fetching location details:", error);
        res.status(500).json({ error: "Failed to fetch location details" });
    }
};