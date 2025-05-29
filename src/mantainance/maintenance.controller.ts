import { Request, Response } from "express";
import * as MaintenanceService from "./maintenance.service";

export const getAllMaintenanceRecords = async (_req: Request, res: Response) => {
    try {
        const records = await MaintenanceService.getAllMaintenanceRecords();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
};

export const getMaintenanceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await MaintenanceService.getMaintenanceById(Number(id));
        if (!record) {
            return res.status(404).json({ error: "Maintenance record not found" });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch maintenance record" });
    }
};

export const createMaintenance = async (req: Request, res: Response) => {
    try {
        const newRecord = await MaintenanceService.createMaintenance(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: "Failed to create maintenance record" });
    }
};

export const updateMaintenance = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await MaintenanceService.updateMaintenance(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Maintenance record not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update maintenance record" });
    }
};

export const deleteMaintenance = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await MaintenanceService.deleteMaintenance(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Maintenance record not found" });
        }
        res.json({ message: "Maintenance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete maintenance record" });
    }
};
