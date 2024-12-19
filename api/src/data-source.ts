import "reflect-metadata";
import { DataSource } from "typeorm";
import { CalendarEntry } from "./models/CalendarEntry";
import { Message } from "./models/Message";
import { ContactInfo } from "./models/ContactInfo";

type DataSourceConfig = {
  database: {
    file: string;
  };
};

export function createDataSource(config: DataSourceConfig) {
  return new DataSource({
    type: "sqlite",
    database: config.database.file,
    synchronize: true, // Automatically synchronize database schema
    logging: true, // Enable logging for debugging
    entities: [CalendarEntry, Message, ContactInfo], // Explicit imports of entities
  });
}
