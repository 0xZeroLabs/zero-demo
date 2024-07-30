import { isVerified } from "./omID.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await isVerified(body.address);
  return {
    response: response,
  };
});
