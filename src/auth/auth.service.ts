import db from "../drizzle/db";
import { CustomerTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { TSCustomerInsert } from "../drizzle/schema";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../mailer/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "youcanguessit";

export const registerUser = async (data: Omit<TSCustomerInsert, "customerID">) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newCustomer: TSCustomerInsert = {
        ...data,
        password: hashedPassword,
        isAdmin: data.isAdmin ?? false
    };

    const result = await db.insert(CustomerTable).values(newCustomer).returning();

    const user = result[0];

    const token = jwt.sign({
        userId: user.customerID,
        email: user.email,
        isAdmin: user.isAdmin
    }, JWT_SECRET,
        { expiresIn: "1d" });

    await sendWelcomeEmail(user.email, user.firstName);

    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await db
        .select()
        .from(CustomerTable)
        .where(eq(CustomerTable.email, email))
        .then((res) => res[0]);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.customerID, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    return { user, token };
};
