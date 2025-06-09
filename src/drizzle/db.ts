import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
    connectionString: process.env.Database_URL as string,
});

let db = drizzle(client, { schema, logger: true });

export const connectToDB = async () => {
    await client.connect();
    console.log("Connected to the database");
};

export const disconnectDB = async () => {
    await client.end();
    console.log("Disconnected from the database");
};

export { db };
