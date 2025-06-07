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

export const getCustomerDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const customerDetails = await CustomerService.getCustomerDetails(Number(id));
        if (!customerDetails) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(customerDetails);
    } catch (error) {
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Failed to fetch customer details" });
    }
};

export const getCustomerReservations = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid customer ID" });
    }

    try {
        const data = await CustomerService.getCustomerReservationDetails(id);

        if (!data) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching customer reservation details:", error);
        res.status(500).json({ error: "Failed to fetch customer reservation details" });
    }
};
