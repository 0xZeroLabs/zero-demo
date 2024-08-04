import { addUser } from "./controllers/db.controller";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let passKey;
  !body.passkeyEncr? passKey = "": passKey = body.passkeyEncr;
  const response = await addUser(body.address, body.pubkey, body?.passwordEncr, passKey);
  return {
    response: response,
  };
});
