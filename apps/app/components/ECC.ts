import EthCrypto from "eth-crypto";

export const encrypt = async (publicKey: string, data: string): Promise<string> => {
  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKey,
    data
  );
  return EthCrypto.cipher.stringify(encrypted);
};

export const decrypt = async (privateKey: string, cipher: string): Promise<string> => {
  const data = EthCrypto.cipher.parse(cipher);
  return await EthCrypto.decryptWithPrivateKey(
        privateKey,
        data
    );
};

export const generatePrivKey = () => {
  return EthCrypto.createIdentity().privateKey;
};

export const generatePubKey = (privateKey: string) => {
  return EthCrypto.publicKeyByPrivateKey(privateKey);
};
