import { sendVerification } from "./controllers/verification.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await sendVerification(body.email, body.code);
  return {
    response: response,
  };
});
