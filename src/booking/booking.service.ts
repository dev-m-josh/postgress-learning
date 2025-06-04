import db from "../drizzle/db";
import { BookingsTable, TSBookingInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { CustomerTable } from "../drizzle/schema";
import { CarTable, LocationTable } from "../drizzle/schema";
import car from '../car/car.routes';

export const getAllBookings = async () => {
    return await db.select().from(BookingsTable);
};

export const getBookingById = async (id: number) => {
    const result = await db.select().from(BookingsTable).where(eq(BookingsTable.bookingID, id));
    return result[0];
};

export const createBooking = async (data: TSBookingInsert) => {
    const result = await db.insert(BookingsTable).values(data).returning();
    return result[0];
};

export const updateBooking = async (id: number, data: Partial<TSBookingInsert>) => {
    const result = await db.update(BookingsTable).set(data).where(eq(BookingsTable.bookingID, id)).returning();
    return result[0];
};

export const deleteBooking = async (id: number) => {
    const result = await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, id)).returning();
    return result.length > 0;
};

//get a booking by id with details its details with customer and car information
export const getBookingDetailsById = async (id: number) => {
    const result = await db
        .select({
            booking: BookingsTable,
            customer: CustomerTable,
            car: CarTable,
            location: LocationTable
        })
        .from(BookingsTable)
        .innerJoin(CustomerTable, eq(BookingsTable.customerID, CustomerTable.customerID))
        .innerJoin(CarTable, eq(BookingsTable.carID, CarTable.carID))
        .innerJoin(LocationTable, eq(CarTable.locationID, LocationTable.locationID))
        .where(eq(BookingsTable.bookingID, id));

    return result[0];
};
