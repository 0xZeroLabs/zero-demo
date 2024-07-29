import { mint } from "./omID.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await mint(body.address);
  return {
    response: response,
  };
});
