<template>
    <div class="bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal top-[60px] p-6 max-lg:left-0 right-0 max-w-[32rem] w-[91.666667%] font-SpaceGrotesk"
        style="margin: 0 auto;">
        <div class="w-full justify-center text-center">
            <h2 class="font-bold text-2xl">
                Welcome, Get Started.
            </h2>
            <form method="post" class="w-full rounded-2xl">
                <input v-model="email" type="email" name="email" placeholder="Email"
                    class="w-full px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                <button type="submit"
                    class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
                    @click.prevent="submitEmail" @keyup.enter="submitEmail">
                    <span>{{ value }}</span>
                </button>
                {{ address }}
                <WaitlistFeedback :formFeedback="(formFeedback as string)" :isLoading="isLoading" />
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePassport } from "./Passport";
let value = ref("Authenticate");

type FormFeedbackType =
    | "incomplete"
    | "consent"
    | "invalid"
    | "error"
    | "success"
    | null;

const email = ref("");
const userInput = ref({
    username: email.value,
    userDisplayName: email.value,
})

const ress = ref();
const consent = ref(true);
const isLoading = ref(false);
const success = ref(true);
const registering = ref(false);
const authenticating = ref(false);
const authenticated = ref(false);
const authenticatedHeader = ref({});
const address = ref("");
const { passport } = usePassport("3119486d-8561-4f87-a507-39241c78fae6");
console.log(passport)
const formFeedback: Ref<FormFeedbackType> = ref(null);

async function authenticate() {
    authenticating.value = true;
    try {
        await passport.setupEncryption();
        const [authenticatedH, addr] = await passport.authenticate(
            userInput.value
        )!;
        authenticatedHeader.value = authenticatedH;
        address.value = addr;
        authenticated.value = true;
    } catch (error) {
        console.error("Error registering:", error);
    } finally {
        authenticating.value = false;
    }
}


const submitEmail = async () => {
    isLoading.value = true;
    value.value = "Loading..."
    formFeedback.value = "";

    email.value = email.value.trim();

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email.value.trim()) {
        formFeedback.value = "incomplete";
        isLoading.value = false;
        value.value = "Authenticate"
        return;
    } else if (email.value && !regex.test(email.value)) {
        formFeedback.value = "invalid";
        success.value = false;
        isLoading.value = false;
        value.value = "Authenticate"
        return;
    } else if (!consent.value) {
        formFeedback.value = "consent";
        success.value = false;
        isLoading.value = false;
        value.value = "Authenticate"
        return;
    } else {
        setTimeout(async () => {
            try {
                registering.value = true;
                try {
                    await passport.setupEncryption();
                    const res = await passport.register(userInput.value);
                    console.log(res);

                    email.value = "";
                    formFeedback.value = "success";
                    success.value = true;

                    if (res.result.account_id) {
                        registering.value = false;
                        authenticating.value = true;
                        await authenticate();
                        authenticating.value = false;
                    }
                } catch (error) {
                    console.error("Error registering:", error);
                } finally {
                    registering.value = false;
                    authenticating.value = false;

                    isLoading.value = false;
                    value.value = "Authenticate"
                }
            } catch (error) {
                success.value = false;
                isLoading.value = false;
                value.value = "Authenticate"
                formFeedback.value = "error";
            }
        }, 4000);
    }
}
</script>