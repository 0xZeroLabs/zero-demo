<script setup lang="ts">
import { generateTree } from "../components/Merkle";
import { createPassportClient } from "@0xpass/passport-viem";
import { http } from "viem";
import { sepolia } from "viem/chains";
import { keccak256, toUtf8Bytes, toUtf8String } from "ethers";

const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL!;
const omIDAddress = "0x15FF4cE254afC98B924a3583C9eC089fcb39c201";
const merkleAddress = "0x6C0f1600271B6707e2E1592AB854054eAc2568e3";
const fallbackProvider = http(alchemyUrl) as unknown as any;

const showModal = ref("hidden");
const showDashboard = ref("visisble");
const sessionToken = useCookie("auth");
const address = useCookie("address");

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
    <div :class="showDashboard" class="w-full">
      <div class="w-full flex justify-center items-center flex-col">
        <div class="w-[160px]">
          <button type="submit" class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
            @click.prevent="" @keyup.enter="">
            <span>Mint Identity</span>
          </button>
        </div>
        <span class="mt-4">{{ address }}</span>
        <CustomVerify />
        <!--
        <Verify class="hidden" />
        <PoP />
        -->
      </div>
    </div>
  </div>
</template>
