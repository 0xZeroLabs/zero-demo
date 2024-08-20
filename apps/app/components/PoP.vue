<template>
    <personhood-sdk session-id="0015a1da-378b-4577-9a7a-33a3ea1bc7e7" :address="account" :sign="sign" @finish="finish" />

    <button @click="sig">Sign</button>
</template>

<script lang="ts" setup>
console.log(global)
import { createPassportClient } from "@0xpass/passport-viem";
import { http } from "viem";
import { sepolia } from "viem/chains";

type CookieRef = {
    value: `0x${string}`
}
const sessionToken = useCookie("auth");
const account: CookieRef = useCookie("address");

const fallbackProvider = http("") as unknown as any;

async function createWalletClient() {
    return await createPassportClient(
        sessionToken.value,
        fallbackProvider,
        sepolia as unknown as any
    );
};

async function sign(payload: any) {
    try {
        const passport = await createWalletClient();
        console.log({ account, message: payload })
        const signature = await passport.signMessage({ account: account.value, message: payload });
        return signature;
    } catch (error) {
        console.error("Error signing message:", error);
        // Handle signing errors gracefully (e.g., notify the user)
        throw error; // Rethrow the error to propagate it
    }
}

const sig = async () => {
    console.log(await sign("fff"));
}

function finish({ info, state }: any) {
    console.log('info', info);
    console.log('state', state);
}
</script>