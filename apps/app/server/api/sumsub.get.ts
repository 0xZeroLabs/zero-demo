import {getAccessToken} from "./controllers/sumsub.controller";

export default defineEventHandler(async (event) => {
  const response = await getAccessToken();
  return {
    response: response,
  };
});
