import db from "../drizzle/db";
import { LocationTable, TSLocationInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const LocationService = {
    getAllLocations: async () => {
        return await db.select().from(LocationTable);
    },

    getLocationById: async (id: number) => {
        const result = await db.select().from(LocationTable).where(eq(LocationTable.locationID, id));
        return result[0];
    },

    addLocation: async (newLocation: TSLocationInsert) => {
        const result = await db.insert(LocationTable).values(newLocation).returning();
        return result[0];
    },

    deleteLocation: async (id: number) => {
        const deleted = await db.delete(LocationTable).where(eq(LocationTable.locationID, id)).returning();
        return deleted[0];
    },

    updateLocation: async (id: number, data: Partial<TSLocationInsert>) => {
        const result = await db.update(LocationTable).set(data).where(eq(LocationTable.locationID, id)).returning();
        return result[0];
    },
};
