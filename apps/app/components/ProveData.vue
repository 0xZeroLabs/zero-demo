<template>
    <div class="min-w-[188px]">
        <button type="submit" class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
            @click.prevent="decrypt">
            <span v-if="isLoading" class="load">Generating Proof..</span>
            <span v-else-if="!userCred.data.credentialSubject.cred.data.dob">Unlock Vault</span>
            <span v-else>Generate Proof</span>
        </button>
    </div>
    <span class="mt-4 max-w-[90%] text-center">This is a demo to show age verification for users above the age of 18
        through zk.</span>
    <span><nuxt-link to="/verify" class="nav-link">Verify Proof</nuxt-link></span>

    <span v-if="generated">
        <a :href="proof" download="proof.json" class="underline">Download Proof</a>
    </span>
    <span v-if="decrypting" class="bg-[rgba(0,0,0,.2)] backdrop-blur-sm z-10 w-full h-full absolute cursor-pointer"
        @click.prevent="notLoading()"></span>
    <PasswordVerify :decrypting="decrypting" />
</template>

<script setup lang="ts">
import * as gen from "./GenerateProofs";

const generated = ref(false);
const isLoading = ref(false);
const proof = ref("");
const decrypting = ref(false)

const userCred = useCookie<any>("userCred");

// check if userCred data is still encrypted to choose between setting the decrypting value to true or just generating proofs
const decrypt = () => {
    const userCredD = userCred.value as any;
    
    (userCredD.data.credentialSubject.cred.data.dob) ? generate() : decrypting.value = true;
}

const notLoading = () => {
    decrypting.value = false;
}

const generate = async () => {
    const userCredD = userCred.value as any;
    
    try {
        const year1 = separateYear(userCredD.data.credentialSubject.cred.data.dob as string)

        const response = await fetch("api/year", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const year2 = (await response.json()).response as number;
        
        isLoading.value = true;
        const a = await gen.generateProof(year2 - year1, 18, "gtoeq");

        const blob = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" });
        proof.value = URL.createObjectURL(blob);

        generated.value = true;
        decrypting.value = false;
        isLoading.value = false;
    } catch (error) {
        generated.value = false;
        decrypting.value = false;
        isLoading.value = false;
        // handle error
    }
}

const separateYear = (date: string) => {
    return Number(date.split("-")[0])
}
</script>