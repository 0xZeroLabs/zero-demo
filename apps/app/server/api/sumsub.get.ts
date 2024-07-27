import {getAccessToken} from "./sumsub.controller";

export default defineEventHandler(async (event) => {
  const response = await getAccessToken();
  return {
    response: response,
  };
});
