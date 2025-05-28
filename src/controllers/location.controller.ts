import { Request, Response } from "express";
import { LocationService } from "../services/location.service";
import { TSLocationInsert } from "../drizzle/schema";

export const getAllLocations = async (req: Request, res: Response) => {
    const locations = await LocationService.getAllLocations();
    if (!locations || locations.length === 0) {
        return res.status(404).json({ error: "No locations found" });
    }
    res.json(locations);
};

export const getLocationById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid location ID" });

    const location = await LocationService.getLocationById(id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    res.json(location);
};

export const addLocation = async (req: Request, res: Response) => {
    const newLocation: TSLocationInsert = req.body;
    try {
        const created = await LocationService.addLocation(newLocation);
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ error: "Failed to add location" });
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid location ID" });

    const deleted = await LocationService.deleteLocation(id);
    if (!deleted) return res.status(404).json({ error: "Location not found" });

    res.json({ message: "Location deleted", location: deleted });
};

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const locationData: Partial<TSLocationInsert> = req.body;
        const updated = await LocationService.updateLocation(id, locationData);

        if (!updated) return res.status(404).json({ message: "Location not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating location", error });
    }
};
