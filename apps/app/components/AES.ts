import EthCrypto from "eth-crypto";
import { randomBytes } from "ethers";
import { encodeBase64Url } from "@std/encoding";
import * as CBOR from "cbor";
import base64url from "base64url";

const credentialId = ref(null);

async function fetchChallengeFromServer(): Promise<ArrayBuffer> {
  try {
    const response = await fetch("/api/generateChallenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    throw error;
  }
}

export async function createPasskey(address: string) {
  const challenge = await fetchChallengeFromServer();

  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: "ZERO Demo",
      id: "localhost",
    },
    user: {
      id: new Uint8Array(16),
      name: address as string,
      displayName: address as string,
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // ECDSA w/ SHA-256 (ES256)
      },
    ],
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
  };

  try {
    const credential: any = await navigator.credentials.create({ publicKey });
    const pubKey = encodeBase64Url(credential.response.getPublicKey());
    console.log(pubKey);
    credentialId.value = credential?.id;
  } catch (error) {
    console.error("Passkey creation failed:", error);
  }
}

async function decryptData(encryptedData: ArrayBuffer) {
  try {
    // 1. Fetch challenge and other parameters from the backend
    const response = await fetch("/api/prepare-decryption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentialId: credentialId.value }),
    });

    const { challenge, timeout, rpId, allowCredentials } =
      await response.json();

    // 2. Prepare the options for `navigator.credentials.get()`
    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge: Uint8Array.from(base64url.toBuffer(challenge)),
      timeout,
      rpId,
      allowCredentials: allowCredentials.map((cred) => ({
        id: Uint8Array.from(base64url.toBuffer(cred.id)),
        type: cred.type,
        transports: cred.transports,
      })),
      userVerification: "preferred",
    };

    // 3. Request the credential from the user
    const credential = await navigator.credentials.get({
      publicKey: publicKeyOptions,
    });

    // 4. Send assertion response to backend for verification
    const assertionResponse = await fetch("/api/verify-assertion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentialId: credentialId.value,
        authenticatorData: Array.from(
          new Uint8Array(credential.response.authenticatorData)
        ),
        clientDataJSON: Array.from(
          new Uint8Array(credential.response.clientDataJSON)
        ),
        signature: Array.from(new Uint8Array(credential.response.signature)),
      }),
    });

    if (!assertionResponse.ok) {
      throw new Error(
        `Server responded with status ${assertionResponse.status}`
      );
    }

    // 5. Get the decrypted symmetric key from the backend
    const { decryptedSymmetricKey } = await assertionResponse.json();

    // 6. Use the decrypted key to decrypt the data
    // ... your decryption logic using the decryptedSymmetricKey ...
  } catch (error) {
    console.error("Error decrypting data:", error);
    // Handle authentication errors or other exceptions
  }
}
