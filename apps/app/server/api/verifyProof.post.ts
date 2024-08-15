import { verifyProof } from "./controllers/proof.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await verifyProof(body.proof);
  return {
    response: response,
  };
});
