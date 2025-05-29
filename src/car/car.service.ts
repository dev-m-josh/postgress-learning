import db from "../drizzle/db"
import { CarTable, TSCarInsert, TSCar } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const getAllCars = async (): Promise<TSCar[]> => {
    return await db.select().from(CarTable);
};

export const getCarById = async (id: number): Promise<TSCar | null> => {
    const car = await db.select().from(CarTable).where(eq(CarTable.carID, id)).limit(1);
    return car.length ? car[0] : null;
};

export const createCar = async (carData: TSCarInsert): Promise<TSCar> => {
    const [newCar] = await db.insert(CarTable).values(carData).returning();
    return newCar;
};

export const updateCar = async (id: number, carData: Partial<TSCarInsert>): Promise<TSCar | null> => {
    const updated = await db.update(CarTable).set(carData).where(eq(CarTable.carID, id)).returning();
    return updated.length ? updated[0] : null;
};

export const deleteCar = async (id: number): Promise<boolean> => {
    const result = await db.delete(CarTable).where(eq(CarTable.carID, id)).returning();
    return result.length > 0;
};