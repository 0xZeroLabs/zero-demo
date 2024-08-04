import { db } from "../../db/setup";
import {
  insertUserSchema,
  users,
  insertCredSchema,
  credentials,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";

/**
 * @param address
 * @returns response
 */
export const addUser = async (
  address: string,
  pubkey: string,
  passwordEncr?: string,
  passkeyEncr?: string
) => {
  const data = {
    address,
    pubkey,
    passwordEncr,
    passkeyEncr,
  };
  const validatedData = insertUserSchema.parse(data);

  if (!validatedData) {
    console.error("Invalid data format! Please check and retry.");
    return "error";
  }
  console.log("here");
  try {
    await db.insert(users).values(validatedData).returning();
    return "success";
  } catch (error) {
    return "error";
  }
};

export const addCred = async (address: string, data: JSON) => {
  const _data = {
    address,
    data,
  };
  const validatedData = insertCredSchema.parse(_data);

  if (!validatedData) {
    console.error("Invalid data format! Please check and retry.");
    return "error";
  }
  try {
    await db.insert(credentials).values(validatedData).returning();
    return "success";
  } catch (error) {
    return "error";
  }
};

export const getUser = async (address: string) => {
  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.address, address))
    .limit(1);

  if (!userData) {
    console.error("User not found");
    return;
  }
  return userData;
};

export const getCred = async (address: string) => {
  const [credData] = await db
    .select()
    .from(credentials)
    .where(eq(credentials.address, address))
    .limit(1);

  if (!credData) {
    console.error("User not found");
    return;
  }
  return credData;
};

export const delCred = async (address: string) => {
  try {
    await db.delete(credentials).where(eq(credentials.address, address));
    return "success";
  } catch (error) {
    return "error";
  }
};

// these are the rudimentary functions needed for such a scale
// the protocol will be extended through its use of KwilDB
