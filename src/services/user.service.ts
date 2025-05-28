import db from "../drizzle/db";
import { CustomerTable, TSCustomer, TSCustomerInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const CustomerService = {

    getAllCustomers: async (): Promise<TSCustomer[]> => {
        return await db.select().from(CustomerTable);
    },

    getCustomerById: async (id: number): Promise<TSCustomer | undefined> => {
        const result = await db.select().from(CustomerTable).where(eq(CustomerTable.customerID, id));
        return result[0];
    },

    addCustomer: async (newCustomer: TSCustomerInsert): Promise<TSCustomer> => {
        const result = await db.insert(CustomerTable).values(newCustomer).returning();
        return result[0];
    },

    deleteCustomer: async (id: number): Promise<TSCustomer | undefined> => {
        const deleted = await db.delete(CustomerTable).where(eq(CustomerTable.customerID, id)).returning();
        return deleted[0];
    },

    updateCustomer: async (id: number, customerData: Partial<TSCustomerInsert>): Promise<TSCustomer | undefined> => {
        const result = await db
            .update(CustomerTable)
            .set(customerData)
            .where(eq(CustomerTable.customerID, id))
            .returning();

        return result[0];
    },
};
