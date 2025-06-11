import {db} from "../drizzle/db";
import { MaintenanceTable, TSMaintenanceInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const getAllMaintenanceRecords = async () => {
    return await db.select().from(MaintenanceTable);
};

export const getMaintenanceById = async (id: number) => {
    const result = await db.select().from(MaintenanceTable).where(eq(MaintenanceTable.maintenanceID, id));
    return result[0];
};

export const createMaintenance = async (data: TSMaintenanceInsert) => {
    const result = await db.insert(MaintenanceTable).values(data).returning();
    return result;
};

export const updateMaintenance = async (id: number, data: Partial<TSMaintenanceInsert>) => {
    const result = await db
        .update(MaintenanceTable)
        .set(data)
        .where(eq(MaintenanceTable.maintenanceID, id))
        .returning();
    return result[0];
};

export const deleteMaintenance = async (id: number) => {
    const result = await db.delete(MaintenanceTable).where(eq(MaintenanceTable.maintenanceID, id)).returning();
    return result.length > 0;
};
