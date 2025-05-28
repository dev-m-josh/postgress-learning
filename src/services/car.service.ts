import db from "../drizzle/db";
import { CarTable, TSCar, TSCarInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const CarService = {
    getAllCars: async (): Promise<TSCar[]> => {
        return await db.select().from(CarTable);
    },

    getCarById: async (id: number): Promise<TSCar | undefined> => {
        const result = await db.select().from(CarTable).where(eq(CarTable.carID, id));
        return result[0];
    },

    addCar: async (newCar: TSCarInsert): Promise<TSCar> => {
        const result = await db.insert(CarTable).values(newCar).returning();
        return result[0];
    },

    deleteCar: async (id: number): Promise<TSCar | undefined> => {
        const deleted = await db.delete(CarTable).where(eq(CarTable.carID, id)).returning();
        return deleted[0];
    },

    updateCar: async (id: number, carData: Partial<TSCarInsert>): Promise<TSCar | undefined> => {
        const result = await db.update(CarTable).set(carData).where(eq(CarTable.carID, id)).returning();

        return result[0];
    },
};
