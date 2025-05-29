import db from "../drizzle/db";
import { PaymentTable, TSPaymentInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/node-postgres';

export const getAllPayments = async () => {
    return await db.select().from(PaymentTable);
};

export const getPaymentById = async (id: number) => {
    const result = await db.select().from(PaymentTable).where(eq(PaymentTable.paymentID, id));
    return result[0];
};

export const createPayment = async (data: TSPaymentInsert) => {
    const result = await db.insert(PaymentTable).values(data).returning();
    return result[0];
};

export const updatePayment = async (id: number, data: Partial<TSPaymentInsert>) => {
    const result = await db.update(PaymentTable).set(data).where(eq(PaymentTable.paymentID, id)).returning();
    return result[0];
};

export const deletePayment = async (id: number) => {
    const result = await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, id)).returning();
    return result.length > 0;
};
