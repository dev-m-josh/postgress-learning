import {db} from "../drizzle/db";
import { LocationTable, TSLocationInsert, TSLocation, CarTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all locations
export const getAllLocations = async (): Promise<TSLocation[]> => {
    return await db.select().from(LocationTable);
};

// Get one location by ID
export const getLocationById = async (id: number): Promise<TSLocation | undefined> => {
    const location = await db.select().from(LocationTable).where(eq(LocationTable.locationID, id));
    return location.length > 0 ? location[0] : undefined;
};

// Create new location
export const createLocation = async (locationData: TSLocationInsert): Promise<TSLocation> => {
    const [newLocation] = await db.insert(LocationTable).values(locationData).returning();
    return newLocation;
};

// Update location by ID
export const updateLocation = async (
    id: number,
    locationData: Partial<TSLocationInsert>
): Promise<TSLocation | undefined> => {
    const updated = await db
        .update(LocationTable)
        .set(locationData)
        .where(eq(LocationTable.locationID, id))
        .returning();

    return updated.length > 0 ? updated[0] : undefined;
};

// Delete location by ID
export const deleteLocation = async (id: number): Promise<boolean> => {
    const result = await db.delete(LocationTable).where(eq(LocationTable.locationID, id)).returning();
    return result.length > 0;
};

export const getLocationWithCars = async (locationID: number) => {
    const results = await db
        .select({
            location: LocationTable,
            car: CarTable,
        })
        .from(LocationTable)
        .leftJoin(CarTable as any, eq(LocationTable.locationID, CarTable.locationID))
        .where(eq(LocationTable.locationID, locationID));

    if (results.length === 0) return {message: "No cars in this Location"};

    const { location } = results[0];

    const cars = results.map((row) => row.car).filter(Boolean);

    return {
        location,
        cars,
    };
};
