import { relations } from "drizzle-orm";
import {
  date,
  text,
  pgTable,
  varchar,
  serial,
  primaryKey,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  address: varchar("address", { length: 256 }).notNull().unique().primaryKey(),
  pubkey: text("pubkey").notNull(),
  passwordEncr: text("password_encr"),
  passkeyEncr: text("passkey_encr"),
  createdAt: date("created_at").default("NOW()"),
});

export const credentials = pgTable("credentials", {
  address: varchar("address", { length: 256 }).notNull().unique().primaryKey(),
  data: json("data"),
});

export const insertUserSchema = createInsertSchema(users, {});
export const insertCredSchema = createInsertSchema(credentials, {});