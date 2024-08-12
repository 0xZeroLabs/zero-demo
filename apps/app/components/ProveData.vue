<template>
    <div class="w-[188px]">
        <button type="submit" class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
            @click.prevent="generate">
        <span v-if="isLoading" class="load">Generate Proof</span>
        <span v-else>Generate Proof</span>
        </button>
    </div>
    <span class="mt-4">This is a demo to show attestation through zk.</span>

    <span v-if="generated">
        <a :href="proof" download="proof.json" class="underline">Download Proof</a>
    </span>
</template>

<script setup lang="ts">
import * as gen from "./GenerateProofs";

const generated = ref(false);
const proof = ref("");
const isLoading = ref(false);

const generate = async () => {
    try {
        isLoading.value = true;
        const a = await gen.generateProof(18, 21, "gtoeq");

        const blob = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" });
        proof.value = URL.createObjectURL(blob);
        
        generated.value = true;
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        generated.value = false;
        // handle error
    }
}

</script>