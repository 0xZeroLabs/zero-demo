import { getSoul } from "./controllers/omID.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await getSoul(body.address);
  return {
    response: response,
  };
});
