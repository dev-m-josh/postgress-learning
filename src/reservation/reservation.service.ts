import db from "../drizzle/db";
import { ReservationTable, TSReservationInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const getAllReservations = async () => {
    return await db.select().from(ReservationTable);
};

export const getReservationById = async (id: number) => {
    const result = await db.select().from(ReservationTable).where(eq(ReservationTable.reservationID, id));
    return result[0];
};

export const createReservation = async (data: TSReservationInsert) => {
    const result = await db.insert(ReservationTable).values(data).returning();
    return result[0];
};

export const updateReservation = async (id: number, data: Partial<TSReservationInsert>) => {
    const result = await db
        .update(ReservationTable)
        .set(data)
        .where(eq(ReservationTable.reservationID, id))
        .returning();
    return result[0];
};

export const deleteReservation = async (id: number) => {
    const result = await db.delete(ReservationTable).where(eq(ReservationTable.reservationID, id)).returning();
    return result.length > 0;
};
