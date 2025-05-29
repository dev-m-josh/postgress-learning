import { Request, Response } from "express";
import * as PaymentService from "./payment.service";

export const getAllPayments = async (_req: Request, res: Response) => {
    try {
        const payments = await PaymentService.getAllPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payments" });
    }
};

export const getPaymentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const payment = await PaymentService.getPaymentById(Number(id));
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payment" });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const newPayment = await PaymentService.createPayment(req.body);
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create payment" });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await PaymentService.updatePayment(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update payment" });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await PaymentService.deletePayment(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete payment" });
    }
};
