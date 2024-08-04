import { hasSoul } from "./controllers/omID.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await hasSoul(body.address);
  return {
    response: response,
  };
});
