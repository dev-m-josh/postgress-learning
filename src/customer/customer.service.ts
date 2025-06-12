import  {db}  from "../drizzle/db";
import { CustomerTable, TSCustomerInsert, BookingsTable, CarTable, ReservationTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const getAllCustomers = async () => {
    return await db.select().from(CustomerTable);
};

export const getCustomerById = async (id: number) => {
    const result = await db.select().from(CustomerTable).where(eq(CustomerTable.customerID, id));
    return result[0];
};

export const updateCustomer = async (id: number, data: Partial<TSCustomerInsert>) => {
    const result = await db.update(CustomerTable).set(data).where(eq(CustomerTable.customerID, id)).returning();
    return result[0];
};

export const deleteCustomer = async (id: number) => {
    const result = await db.delete(CustomerTable).where(eq(CustomerTable.customerID, id)).returning();
    return result.length > 0;
};

export const getCustomerDetails = async (id: number) => {
    const result = await db
        .select({
            customer: CustomerTable,
            booking: BookingsTable,
            car: CarTable,
        })
        .from(CustomerTable)
        .leftJoin(BookingsTable as any, eq(CustomerTable.customerID, BookingsTable.customerID))
        .leftJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
        .where(eq(CustomerTable.customerID, id));

    return result;
};

export const getCustomerReservationDetails = async (id: number) => {
    const result = await db
        .select({
            customer: CustomerTable,
            reservation: ReservationTable,
            car: CarTable,
        })
        .from(CustomerTable)
        .leftJoin(ReservationTable as any, eq(CustomerTable.customerID, ReservationTable.customerID))
        .leftJoin(CarTable as any, eq(ReservationTable.carID, CarTable.carID))
        .where(eq(CustomerTable.customerID, id));

    return result;
};
