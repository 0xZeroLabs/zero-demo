import { getUser } from "./controllers/db.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await getUser(body.address);
  return {
    response: response,
  };
});
