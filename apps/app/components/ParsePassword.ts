import CryptoJS from "crypto-js";

export const hashPassword = (password: string) => {
  const config = useRuntimeConfig();
  const salt = config.public.salt;

  return CryptoJS.AES.encrypt(password, salt).toString();
};

export const parsePassword = (hash: string) => {
  const config = useRuntimeConfig();
  const salt = config.public.salt;

  return CryptoJS.AES.decrypt(hash, salt).toString(CryptoJS.enc.Utf8);
};
