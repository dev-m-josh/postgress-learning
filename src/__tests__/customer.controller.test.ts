import request from "supertest";
import express from "express";
import * as CustomerService from "../customer/customer.service";
import { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../customer/customer.controller";

// Step 1: Set up a minimal Express app for testing
const app = express();
app.use(express.json());
app.get("/customer", getAllCustomers);
app.get("/customer/:id", getCustomerById as any);
app.put("/customer/:id", updateCustomer as any);
app.delete("/customer/:id", deleteCustomer as any);

// Step 2: Mock the car service
jest.mock("../customer/customer.service");

// Step 3: Test the controller
describe("Customer Controller", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    //testing getting all customers
    test("GET /customer should return all customers", async () => {
        (CustomerService.getAllCustomers as jest.Mock).mockResolvedValue([
            {
                customerID: 1,
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@gmail.com",
                password: "password",
                phoneNumber: "555-1234",
                address: "123 Main St",
                isAdmin: false,
            },
            {
                customerID: 2,
                firstName: "Jane",
                lastName: "Smith",
                email: "janesmith@gmail.com",
                password: "password",
                phoneNumber: "555-5678",
                address: "456 Elm St",
                isAdmin: false,
            },
        ]);
        const response = await request(app).get("/customer");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                customerID: 1,
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@gmail.com",
                password: "password",
                phoneNumber: "555-1234",
                address: "123 Main St",
                isAdmin: false,
            },
            {
                customerID: 2,
                firstName: "Jane",
                lastName: "Smith",
                email: "janesmith@gmail.com",
                password: "password",
                phoneNumber: "555-5678",
                address: "456 Elm St",
                isAdmin: false,
            },
        ]);
    });

    //testing getting a single customer
    test("GET /customer/:id should return a single customer", async () => {
        (CustomerService.getCustomerById as jest.Mock).mockResolvedValue({
            customerID: 1,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            password: "password",
            phoneNumber: "555-1234",
            address: "123 Main St",
            isAdmin: false,
        });
        const response = await request(app).get("/customer/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            customerID: 1,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            password: "password",
            phoneNumber: "555-1234",
            address: "123 Main St",
            isAdmin: false,
        });
    });

    //testing if no customer is found
    test("GET /customer/:id should return 404 if customer not found", async () => {
        if ((CustomerService.getCustomerById as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).get("/customer/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Customer not found" });
        }
        if ((CustomerService.updateCustomer as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).put("/customer/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Customer not found" });
        }
        if ((CustomerService.deleteCustomer as jest.Mock).mockResolvedValue(null)) {
            const response = await request(app).delete("/customer/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Customer not found" });
        }
    });

    //testing if an error occured
    test("GET /customer/:id should return 500 if an error occurs", async () => {
        if ((CustomerService.getAllCustomers as jest.Mock).mockRejectedValue(new Error("Failed to fetch customers"))) {
            const response = await request(app).get("/customer");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch customers" });

        }
        if ((CustomerService.getCustomerById as jest.Mock).mockRejectedValue(new Error("Failed to fetch customer"))) {
            const response = await request(app).get("/customer/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to fetch customer" });
        }
        if((CustomerService.updateCustomer as jest.Mock).mockRejectedValue(new Error("Failed to update customer"))){
            const response = await request(app).put("/customer/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update customer" });
        }
        if((CustomerService.deleteCustomer as jest.Mock).mockRejectedValue(new Error("Failed to delete customer"))){
            const response = await request(app).delete("/customer/999");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete customer" });
        }
    });

    //testing updating a customer
    test("PUT /customer/:id should update a customer", async () => {
        (CustomerService.updateCustomer as jest.Mock).mockResolvedValue({
            customerID: 1,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            password: "password",
            phoneNumber: "555-1234",
            address: "123 Main St",
            isAdmin: false,
        });
        const response = await request(app).put("/customer/1").send({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            password: "password",
            phoneNumber: "555-1234",
            address: "123 Main St",
            isAdmin: false,
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            customerID: 1,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            password: "password",
            phoneNumber: "555-1234",
            address: "123 Main St",
            isAdmin: false,
        });
    });

    //testing deleting a customer
    test("DELETE /customer/:id should delete a customer", async () => {
        (CustomerService.deleteCustomer as jest.Mock).mockResolvedValue({});
        const response = await request(app).delete("/customer/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Customer deleted successfully" });
    });
});