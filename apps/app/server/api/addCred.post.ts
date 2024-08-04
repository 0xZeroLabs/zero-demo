import { addCred } from "./controllers/db.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await addCred(body.address, body.data);
  return {
    response: response,
  };
});
