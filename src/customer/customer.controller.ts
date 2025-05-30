import { Request, Response } from "express";
import * as CustomerService from "./customer.service";


export const getAllCustomers = async (_req: Request, res: Response) => {
    try {
        const customers = await CustomerService.getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};

export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const customer = await CustomerService.getCustomerById(Number(id));
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch customer" });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updated = await CustomerService.updateCustomer(Number(id), req.body);
        if (!updated) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update customer" });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await CustomerService.deleteCustomer(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete customer" });
    }
};
