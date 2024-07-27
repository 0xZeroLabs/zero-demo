import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import FormData from "form-data";

const _config = useRuntimeConfig();
console.log(config);

const SUMSUB_APP_TOKEN = _config.public.appToken as string;
const SUMSUB_SECRET_KEY = _config.public.secretKey as string;
const SUMSUB_BASE_URL = "https://api.sumsub.com";

var config: any = {};
config.baseURL = SUMSUB_BASE_URL;

axios.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
});

function createSignature(config: any) {
  console.log("Creating a signature for the request...");

  var ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }
  console.log(config.data);
  config.headers["X-App-Access-Ts"] = ts;
  config.headers["X-App-Access-Sig"] = signature.digest("hex");

  return config;
}

const createAccessToken = (
  externalUserId: string | number | boolean,
  levelName = "basic-kyc-level",
  ttlInSecs = 600
) => {
  console.log("Creating an access token for initializng SDK...");

  var method = "post";
  var url =
    "/resources/accessTokens?userId=" +
    encodeURIComponent(externalUserId) +
    "&ttlInSecs=" +
    ttlInSecs +
    "&levelName=" +
    encodeURIComponent(levelName);

  var headers = {
    Accept: "application/json",
    "X-App-Token": SUMSUB_APP_TOKEN,
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;

  return config;
};

export const getAccessToken = async () => {
  const externalUserId =
    "random-JSToken-" + Math.random().toString(36).substr(2, 9);
  const levelName = "basic-kyc-level";
  console.log("External UserID: ", externalUserId);
  let res;

  await axios(createAccessToken(externalUserId, levelName, 1200))
    .then(function (response) {
      res = response.data.token;
      return response.data.token;
    })
    .catch(function (error) {
      console.log("Error:\n", error.response.data);
    });
  return res;
};
