<template>
    <div v-if="decrypting" class="w-full h-full flex justify-center items-center absolute">
        <div class="bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal p-6 max-w-[32rem] md:w-[91.666667%] font-SpaceGrotesk"
            style="margin: 0 auto;">
            <div class="w-full justify-center text-center">
                <h2 class="font-bold text-2xl">
                    Verify Your Vault.
                </h2>
                <form method="post" class="w-full rounded-2xl">
                    <input v-model="password" type="password" name="password" placeholder="Password"
                        class="w-full px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                    <span class="text-left block mt-2">This decrypts your data! Used for proof generation.</span>
                    <button type="submit"
                        class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-3 btn"
                        @click.prevent="submitPassword" @keyup.enter="">
                        <span v-if="isLoading" class="load">Submitting..</span>
                        <span v-else>Submit</span>
                    </button>
                    <PasswordVerifyFeedback :form-feedback="formFeedback" />
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { hashPassword, parsePassword } from "./ParsePassword.js"
import { encrypt, decrypt, generatePrivKey, generatePubKey } from "./ECC";

const props = defineProps({
    decrypting: Boolean,
});

const password = ref("");
const formFeedback = ref();
const isLoading = ref(false);

const sessionToken = useCookie("auth");
const address = useCookie("address");
const zkyc = useCookie("zkyc");
const user = useCookie("user");
const userCred = useCookie("userCred");

const submitPassword = async () => {
    formFeedback.value = null;
    if (!password.value.trim()) {
        formFeedback.value = "incomplete";
        return;
    } else if (!(password.value.length >= 8) || !(/^(?=.*[A-Z])/.test(password.value)) || !(/^(?=.*[a-z])/.test(password.value)) || !(/^(?=.*[0-9])/.test(password.value)) || !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password.value)) {
        formFeedback.value = "invalid";
        return;
    }

    const userD = user.value as any;
    const privKey = parsePassword(password.value, userD.passwordEncr)

    const userCredD = userCred.value as any;

    

    try {
        isLoading.value = true;
        await decrypt(privKey, userCredD.data.credentialSubject.cred.data).then(r => {
            userCredD.data.credentialSubject.cred.data = JSON.parse(r);
            userCred.value = userCredD;
            isLoading.value = false;
            formFeedback.value = "success"
        })
    } catch (error) {
        error == "Error: Bad private key" ? formFeedback.value = "Wrong Password!" : formFeedback.value = error as any;
        isLoading.value = false;
    }
}

const getValuesFromObject = (jsonObject: { [key: string]: any }): any[] => {
    const values: any[] = [];

    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            const value = jsonObject[key];

            if (Array.isArray(value)) {
                // if the value is an array, recursively extract its values
                values.push(...getValuesFromObject(value));
            } else if (typeof value === 'object' && value !== null) {
                // if the value is an object, recursively extract its values
                values.push(...getValuesFromObject(value));
            } else {
                // otherwise, push the value directly
                values.push(whitespaceToHyphen(value));
            }
        }

    }

    return values;
}

const whitespaceToHyphen = (input: string): string => {
    return input.replace(/\s+/g, '-').toLowerCase();
}
</script>