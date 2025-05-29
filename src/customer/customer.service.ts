import  db  from "../drizzle/db"; // adjust this import to your actual db client
import { CustomerTable, TSCustomerInsert } from "../drizzle/schema"; // adjust the path if needed
import { eq } from "drizzle-orm";
export const getAllCustomers = async () => {
    return await db.select().from(CustomerTable);
};


export const getCustomerById = async (id: number) => {
    const result = await db.select().from(CustomerTable).where(eq(CustomerTable.customerID, id));
    return result[0];
};

export const createCustomer = async (data: TSCustomerInsert) => {
    const result = await db.insert(CustomerTable).values(data).returning();
    return result[0];
};

export const updateCustomer = async (id: number, data: Partial<TSCustomerInsert>) => {
    const result = await db.update(CustomerTable).set(data).where(eq(CustomerTable.customerID, id)).returning();
    return result[0];
};

export const deleteCustomer = async (id: number) => {
    const result = await db.delete(CustomerTable).where(eq(CustomerTable.customerID, id)).returning();
    return result.length > 0;
};
