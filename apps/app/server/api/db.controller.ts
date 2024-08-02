import { db } from "../db/setup";
import {
  insertUserSchema,
  users,
  insertCredSchema,
  credentials,
} from "../db/schema";

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
  try {
    await db.insert(users).values(validatedData).returning();
    return "success";
  } catch (error) {
    return "negligible";
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
    return "negligible";
  }
};

/**
 * functions left:
 * getUser, getCred, delCred
 * 
 * these are the rudimentary functions needed for such a scale
 * the protocol will be extended through its use of KwilDB
 * 
 */