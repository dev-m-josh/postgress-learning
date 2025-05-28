import { Router } from "express";
import {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    deleteCustomer,
    updateCustomer,
} from "../controllers/user.controller";

export const customerRoutes = Router();

customerRoutes.get("/", getAllCustomers);
customerRoutes.get("/:id", getCustomerById);
customerRoutes.post("/", addCustomer);
customerRoutes.delete("/:id", deleteCustomer);
customerRoutes.put("/:id", updateCustomer);
