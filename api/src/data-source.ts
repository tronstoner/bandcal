import "reflect-metadata";
import { DataSource } from "typeorm";
import { CalendarEntry } from "./models/CalendarEntry";
import { Message } from "./models/Message";
import { ContactInfo } from "./models/ContactInfo";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "../db/database.sqlite",
  synchronize: true, // Automatically synchronize database schema
  logging: true, // Enable logging for debugging
  entities: [CalendarEntry, Message, ContactInfo], // Explicit imports of entities
});
