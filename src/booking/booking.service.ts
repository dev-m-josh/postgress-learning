import db from "../drizzle/db";
import { BookingsTable, TSBookingInsert,CarTable, LocationTable, PaymentTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { CustomerTable } from "../drizzle/schema";


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

export const getBookingDetailsById = async (id: number) => {
    const result = await db
        .select({
            booking: BookingsTable,
            customer: CustomerTable,
            car: CarTable,
            location: LocationTable
        })
        .from(BookingsTable)
        .innerJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
        .innerJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
        .innerJoin(LocationTable as any, eq(CarTable.locationID, LocationTable.locationID))
        .where(eq(BookingsTable.bookingID, id));

    return result[0];
};

export const getBookingWithPayment = async (bookingId: number) => {
    const result = await db
        .select({
            booking: BookingsTable,
            customer: CustomerTable,
            car: CarTable,
            payment: PaymentTable,
        })
        .from(BookingsTable)
        .innerJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
        .innerJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
        .innerJoin(PaymentTable as any, eq(BookingsTable.bookingID, PaymentTable.bookingID))
        .where(eq(BookingsTable.bookingID, bookingId));

    return result[0];
};
