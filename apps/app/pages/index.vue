<script setup lang="ts">
import { generateTree } from "../components/Merkle";
import { createPassportClient } from "@0xpass/passport-viem";
import { http } from "viem";
import { sepolia } from "viem/chains";

const poll = generateTree(["abc", "cde", "efg"]);
const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL!;
const fallbackProvider = http(alchemyUrl) as unknown as any;

const showModal = ref("hidden");
const showDashboard = ref("visisble");
const sessionToken = useCookie("auth");
const address = useCookie("address");
console.log(sessionToken.value);

async function createWalletClient() {
  return await createPassportClient(
    sessionToken.value,
    fallbackProvider,
    sepolia as unknown as any
  );
}

if (!sessionToken.value) {
  showModal.value = "visible"
  showDashboard.value = "hidden"
} else {
  showModal.value = "hidden"
  showDashboard.value = "visible"
}
</script>

<template>
  <div class="min-h-[calc(100vh-216px)] flex items-center font-SpaceGrotesk">
    <Head>
      <title>ZΞRO Demo</title>
    </Head>
    <Register :class="showModal" />
    <div :class="showDashboard">
      <span>Address: {{ address }}</span>
    </div>
  </div>
</template>
