import CryptoJS from "crypto-js";

export const hashPassword = (password: string, data: string) => {
  return CryptoJS.AES.encrypt(data, password).toString();
};

export const parsePassword = (password: string, hash: string) => {
  return CryptoJS.AES.decrypt(hash, password).toString(CryptoJS.enc.Utf8);
};
