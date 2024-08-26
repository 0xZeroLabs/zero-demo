import * as simplewebauthn from "@simplewebauthn/browser";
import { encodeBase64Url } from "@std/encoding";

const credentialId = ref("");

async function fetchOptsFromServer(address: string): Promise<any> {
  try {
    const response = await useFetch("/api/options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        address: address
      },
    });
    
    return response?.data.value?.response;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    throw error;
  }
}

export async function createPasskey(address: string) {
  const key = await fetchOptsFromServer(address);

  try {
    const credential = await simplewebauthn.startRegistration(key);
    const pubKey = credential?.response.publicKey;
    
    credentialId.value = credential?.id;
  } catch (error) {
    console.error("Passkey creation failed:", error);
  }
}

export async function authPasskey(address: string) {
  const key = await fetchOptsFromServer(address);

  try {
    const credential = await simplewebauthn.startAuthentication(key);
    const pubKey = credential?.response;
    
    credentialId.value = credential?.id;
  } catch (error) {
    console.error("Passkey creation failed:", error);
  }
}