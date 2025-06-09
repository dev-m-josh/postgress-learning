import { Request, Response } from "express";
import * as InsuranceService from "./insurance.service";

export const getAllInsuranceRecords = async (_req: Request, res: Response) => {
    try {
        const records = await InsuranceService.getAllInsuranceRecords();
        res.json(records);
    } catch (error) {
        console.log("Error fetching insurance records:",error);
        res.status(500).json({ error: "Failed to fetch insurance records" });
    }
};

export const getInsuranceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await InsuranceService.getInsuranceById(Number(id));
        if (!record) {
            return res.status(404).json({ error: "Insurance record not found" });
        }
        res.json(record);
    } catch (error) {
        console.log("Error fetching insurance record:",error);
        res.status(500).json({ error: "Failed to fetch insurance record" });
    }
};

export const createInsurance = async (req: Request, res: Response) => {
    try {
        const newRecord = await InsuranceService.createInsurance(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        console.log("Error creating insurance record:",error);
        res.status(500).json({ error: "Failed to create insurance record" });
    }
};

export const updateInsurance = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await InsuranceService.updateInsurance(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Insurance record not found" });
        }
        res.json(updated);
    } catch (error) {
        console.log("Error updating insurance record:",error);
        res.status(500).json({ error: "Failed to update insurance record" });
    }
};

export const deleteInsurance = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await InsuranceService.deleteInsurance(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Insurance record not found" });
        }
        res.json({ message: "Insurance record deleted successfully" });
    } catch (error) {
        console.log("Error deleting insurance record:",error);
        res.status(500).json({ error: "Failed to delete insurance record" });
    }
};
