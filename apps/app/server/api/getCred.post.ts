import { getCred } from "./controllers/db.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await getCred(body.address);
  return {
    response: response,
  };
});
