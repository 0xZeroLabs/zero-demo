<template>
    <div class="w-[160px]">
        <button type="submit" class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
            @click.prevent="mint()" :disabled="isLoading">
            <span v-if="isLoading">Minting..</span>
            <span v-else>Mint Identity</span>
        </button>
    </div>
    <span class="mt-4">{{ address }}</span>
    <MintFeedback :url="url" :formFeedback="(formFeedback as string)" :isLoading="isLoading" />
</template>
<script lang="ts" setup>
type FormFeedbackType =
    | "incomplete"
    | "consent"
    | "invalid"
    | "error"
    | "success"
    | null;

type SendData = {
    response: {
        url: string;
        message: string;
    }
};

const isLoading = ref(false);
const formFeedback: Ref<FormFeedbackType> = ref(null);

const url = ref("");
const address = useCookie("address");

const mint = async () => {
    isLoading.value = true;
    formFeedback.value = null;
    setTimeout(async () => {
        try {
            const { data: response } = await useFetch("api/mint", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    address: address,
                }
            });

            const res: Ref<SendData> = ref(response) as Ref<SendData>;
            res.value.response.url ? formFeedback.value = "success" : formFeedback.value = "error";
            isLoading.value = false;
            url.value = res.value.response.url;
            console.log(url.value)
        } catch (error) {
            formFeedback.value = "error";
            isLoading.value = false;
            console.log(error)
        }
    }, 4000);
}
</script>