<template>
    <PersonhoodSdk session-id="01234567-8901-2345-6789-012345678901" :address="address.value" :sign="sign"
        @finish="finish()" />
</template>

<script lang="ts" setup>
import PersonhoodSdk from "@anima-protocol/personhood-sdk-vue/dist/personhood-sdk-vue.es.js";
import { createPassportClient } from "@0xpass/passport-viem";
import { http } from "viem";
import { sepolia } from "viem/chains";

const sessionToken = useCookie("auth");
const address = useCookie("address");

const fallbackProvider = http("") as unknown as any;

async function createWalletClient() {
    return await createPassportClient(
        sessionToken.value,
        fallbackProvider,
        sepolia as unknown as any
    );
};

async function sign(payload) {
    try {
        const passport = await createWalletClient();
        console.log(payload)
        const signature = await passport.signMessage({ account: address, message: payload });
        return signature;
    } catch (error) {
        console.error("Error signing message:", error);
        // Handle signing errors gracefully (e.g., notify the user)
        throw error; // Rethrow the error to propagate it
    }
}

function finish({ info, state }) {
    console.log('info', info);
    console.log('state', state);
}
</script>