import { verify } from "./controllers/omID.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await verify(body.address, body.zkHash);
  return {
    response: response,
  };
});
