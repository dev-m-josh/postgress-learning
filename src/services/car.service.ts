// src/services/car.service.ts
import db from "../drizzle/db";
import { CarTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { NewCar } from "../types/car.types";

export const CarService = {
    getAllCars: async () => {
        return await db.select().from(CarTable);
    },

    getCarById: async (id: number) => {
        const result = await db.select().from(CarTable).where(eq(CarTable.carID, id));
        return result[0];
    },

    addCar: async (newCar: NewCar) => {
        const result = await db.insert(CarTable).values(newCar).returning();
        return result[0];
    },

    deleteCar: async (id: number) => {
        const deleted = await db.delete(CarTable).where(eq(CarTable.carID, id)).returning();
        return deleted[0];
    },
};
