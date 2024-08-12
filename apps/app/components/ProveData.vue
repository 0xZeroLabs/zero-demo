<template>
    <div class="w-[188px]">
        <button type="submit" class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
            @click.prevent="generate">
            <span>Prove Age</span>
        </button>
    </div>
    <span class="mt-4">This is a demo to show attestation through zk.</span>
</template>

<script setup lang="ts">
import * as gen from "./GenerateProofs";

let proof = "";

const generate = async () => {
    gen.generateProof(18, 21, "gtoeq").then(a => proof.value = JSON.stringify(a, null, 2));
}

</script>