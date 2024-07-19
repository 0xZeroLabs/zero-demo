<template>
    <div class="bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal p-6 max-w-[32rem] md:w-[91.666667%] font-SpaceGrotesk"
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
                    @click.prevent="register" @keyup.enter="" :class="registerState">
                    <span>{{ value }}</span>
                </button>
                <button type="submit"
                    class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
                    @click.prevent="authenticate" @keyup.enter="" :class="signinState">
                    <span>{{ value2 }}</span>
                </button>

                <span @click="toggleButtonState" class="hover:cursor-pointer block mt-2 prevent-select">{{ spanVal
                    }}</span>
                <WaitlistFeedback :formFeedback="(formFeedback as string)" :isLoading="isLoading" />
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePassport } from "./Passport";
let value = ref("Authenticate");
let value2 = ref("Sign In");

type FormFeedbackType =
    | "incomplete"
    | "consent"
    | "invalid"
    | "error"
    | "success"
    | null;

const email = ref("");

const consent = ref(true);
const isLoading = ref(false);
const success = ref(true);
const registering = ref(false);
const authenticating = ref(false);
const authenticated = ref(false);
const sessionToken = useCookie<{}>("auth")
const address = useCookie<string>("address");
const { passport } = usePassport("49a15cec-22ac-4920-a6c2-e26def45c5fb");

const formFeedback: Ref<FormFeedbackType> = ref(null);

async function authenticate() {
    isLoading.value = true;
    value2.value = "Loading..."
    authenticating.value = true;

    email.value = email.value.trim();

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email.value.trim()) {
        formFeedback.value = "incomplete";
        isLoading.value = false;
        value2.value = "Sign In"
        return;
    } else if (email.value && !regex.test(email.value)) {
        formFeedback.value = "invalid";
        success.value = false;
        isLoading.value = false;
        value2.value = "Sign In"
        return;
    } else if (!consent.value) {
        formFeedback.value = "consent";
        success.value = false;
        isLoading.value = false;
        value2.value = "Sign In"
        return;
    } else {
        setTimeout(async () => {
            try {
                try {
                    const userInput = ref({
                        username: email.value,
                        userDisplayName: email.value,
                    })
                    await passport.setupEncryption();
                    const [authenticatedH, addr] = await passport.authenticate(
                        userInput.value,
                    )!;
                    sessionToken.value = authenticatedH;

                    address.value = addr;
                    authenticated.value = true;
                    email.value = "";
                } catch (error) {
                    console.error("Error authenticating:", error);
                } finally {
                    authenticating.value = false;
                    isLoading.value = false;
                    value2.value = "Sign In";
                    reloadNuxtApp()
                }
            }
            catch (error) {
                success.value = false;
                isLoading.value = false;
                value.value = "Authenticate"
                formFeedback.value = "error";
            }
        }, 4000);
    }
}


const register = async () => {
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
                const userInput = ref({
                    username: email.value,
                    userDisplayName: email.value,
                })
                try {
                    await passport.setupEncryption();
                    const res = await passport.register(userInput.value);
                    console.log(res);

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


let registerState = ref("visible")
let signinState = ref("hidden")
let spanVal = ref("Already have an Account?")
const toggleButtonState = () => {
    if (signinState.value == "hidden") {
        signinState.value = "visible"
        registerState.value = "hidden"
        spanVal.value = "Create an Account?"
    } else {
        signinState.value = "hidden"
        registerState.value = "visible"
        spanVal.value = "Already have an Account?"
    }
}
</script>

<style>
.prevent-select {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>