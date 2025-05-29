import db from "../drizzle/db";
import { InsuranceTable, TSInsuranceInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const getAllInsuranceRecords = async () => {
    return await db.select().from(InsuranceTable);
};

export const getInsuranceById = async (id: number) => {
    const result = await db.select().from(InsuranceTable).where(eq(InsuranceTable.insuranceID, id));
    return result[0];
};

export const createInsurance = async (data: TSInsuranceInsert) => {
    const result = await db.insert(InsuranceTable).values(data).returning();
    return result[0];
};

export const updateInsurance = async (id: number, data: Partial<TSInsuranceInsert>) => {
    const result = await db.update(InsuranceTable).set(data).where(eq(InsuranceTable.insuranceID, id)).returning();
    return result[0];
};

export const deleteInsurance = async (id: number) => {
    const result = await db.delete(InsuranceTable).where(eq(InsuranceTable.insuranceID, id)).returning();
    return result.length > 0;
};
