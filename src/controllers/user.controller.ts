import { Request, Response } from "express";
import { CustomerService } from "../services/user.service";
import { TSCustomerInsert } from "../drizzle/schema";

export const getAllCustomers = async (req: Request, res: Response) => {
    const customers = await CustomerService.getAllCustomers();
    if (!customers || customers.length === 0) {
        return res.status(404).json({ error: "No customers found" });
    }
    res.json(customers);
};

export const getCustomerById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid customer ID" });

    const customer = await CustomerService.getCustomerById(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.json(customer);
};

export const addCustomer = async (req: Request, res: Response) => {
    const newCustomer: TSCustomerInsert = req.body;
    try {
        const createdCustomer = await CustomerService.addCustomer(newCustomer);
        res.status(201).json(createdCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add customer" });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid customer ID" });
    }

    const deletedCustomer = await CustomerService.deleteCustomer(id);
    if (!deletedCustomer) {
        return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully", customer: deletedCustomer });
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const customerData: Partial<TSCustomerInsert> = req.body;
        const updatedCustomer = await CustomerService.updateCustomer(id, customerData);

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error });
    }
};
