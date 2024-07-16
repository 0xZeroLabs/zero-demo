<template>
    <div class="absolute bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal top-[60px] p-6 max-lg:left-0 right-0 max-w-[32rem] w-[91.666667%] font-SpaceGrotesk"
        style="margin: 0 auto;">
        <div class="w-full justify-center text-center">
            <h2 class="font-bold text-2xl">
                Welcome to the front lines of the revolution.
            </h2>
            <form method="post" class="w-full rounded-2xl">
                <input v-model="email" type="email" name="email" placeholder="Email"
                    class="w-full px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                <button type="submit"
                    class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
                    @click.prevent="" @keyup.enter="">
                    <span>{{ value }}</span>
                </button>
                <WaitlistFeedback :formFeedback="(formFeedback as string)" :isLoading="isLoading" />
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
let value = ref("Submit");

type FormFeedbackType =
    | "incomplete"
    | "consent"
    | "invalid"
    | "error"
    | "success"
    | null;

const email = ref("");
const isLoading = ref(false);
const formFeedback: Ref<FormFeedbackType> = ref(null);
</script>