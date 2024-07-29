<script setup lang="ts">
import { generateTree } from "../components/Merkle";
import { createPassportClient } from "@0xpass/passport-viem";
import { http } from "viem";
import { sepolia } from "viem/chains";
import { keccak256, toUtf8Bytes, toUtf8String } from "ethers";

const config = useRuntimeConfig();
const alchemyUrl = config.public.rpc;
const fallbackProvider = http(alchemyUrl) as unknown as any;

const showModal = ref(false);
const isPageLoading = ref(true);
const showDashboard = ref("visisble");
const sessionToken = useCookie("auth");
const address = useCookie("address");

const mint = ref(true);

async function createWalletClient() {
  return await createPassportClient(
    sessionToken.value,
    fallbackProvider,
    sepolia as unknown as any
  );
}
type SendData = {
  response: {
    url: string;
    message: string;
    pass: Boolean;
  }
};

if (!sessionToken.value) {
  showModal.value = true;
} else {
  showModal.value = false;
}

onMounted(async () => {
  setTimeout(async () => {
    const { data: response } = await useFetch("api/hasSoul", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        address: address,
      }
    });

    const res: Ref<SendData> = ref(response) as Ref<SendData>;
    mint.value = !res.value.response.pass;
    isPageLoading.value = false;
  }, 4000);
});
</script>

<template>
  <div class="min-h-[calc(100vh-216px)] flex items-center font-SpaceGrotesk">
    <Head>
      <title>ZΞRO Demo</title>
    </Head>
    <Register v-if="showModal" />
    <div v-else-if="isPageLoading" class="w-screen h-full flex justify-center items-center">

      <div class="loader font-SpaceGrotesk bold uppercase"></div>

    </div>
    <div v-else class="w-full">
      <div class="w-full flex justify-center items-center flex-col">
        <Mint v-if="mint" />
        <CustomVerify />
        <!--
        <Verify class="hidden" />
        <PoP />
        -->
      </div>
    </div>
  </div>
</template>


<style>
.loader {
  width: fit-content;
  font-size: 30px;
  background: linear-gradient(135deg, #0000 calc(50% - 0.5em), #fff 0 calc(50% + 0.5em), #0000 0) right/300% 100%;
  animation: l22 2s infinite;
}

.loader::before {
  content: "Loading...";
  color: #fff;
  padding: 0 5px;
  background: inherit;
  background-image: linear-gradient(135deg, #fff calc(50% - 0.5em), #000 0 calc(50% + 0.5em), #fff 0);
  -webkit-background-clip: text;
  background-clip: text;
}

@keyframes l22 {
  100% {
    background-position: left
  }
}
</style>