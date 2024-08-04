import { delCred } from "./controllers/db.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await delCred(body.address);
  return {
    response: response,
  };
});
