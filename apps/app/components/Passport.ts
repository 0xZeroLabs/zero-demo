import { WebauthnSigner } from "@0xpass/webauthn-signer";
import { Network, Passport } from "@0xpass/passport";

export function usePassport(scopeId: string) {
  const signerRef = ref<WebauthnSigner | null>(null);
  const passportRef = ref<Passport | null>(null);

  if (!signerRef.value) {
    signerRef.value = new WebauthnSigner({
      rpId: 'demo.0xzero.org'!,
      rpName: "0xZero",
    });
  }

  if (!passportRef.value) {
    passportRef.value = new Passport({
      scopeId: scopeId,
      signer: signerRef.value,
      network: Network.TESTNET,
    });
  }

  return {
    passport: passportRef.value,
    signer: signerRef.value,
  };
}