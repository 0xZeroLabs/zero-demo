<template>
    <div class="bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal p-6 max-w-[32rem] md:w-[91.666667%] font-SpaceGrotesk"
        style="margin: 0 auto;">
        <div class="w-full justify-center text-center">
            <h2 class="font-bold text-2xl">
                Verify your Identity.
            </h2>
            <form method="post" class="w-full rounded-2xl">
                <div class="w-full flex justify-between">
                    <input v-model="firstname" type="text" name="firstname" placeholder="First Name"
                        class="w-[calc(60%-8px)] px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                    <input v-model="lastname" type="text" name="lastname" placeholder="Last Name"
                        class="w-[40%] px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                </div>
                <input v-model="dob" type="date" name="dob"
                    class="w-full px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                <div class="w-full mt-3">
                    <span class="text-left block mb-2">Country: </span>
                    <CountryCode v-model="country" />
                </div>
                <button type="submit"
                    class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
                    @click.prevent="submitForm" @keyup.enter="">
                    <span>Submit</span>
                </button>
                <CustomVerifyFeedback :form-feedback="formFeedback" />
            </form>
        </div>
    </div>
    <div v-if="encrypting" class="w-full h-full flex justify-center items-center absolute">
        <span class="bg-[rgba(0,0,0,.2)] backdrop-blur-sm z-10 w-full h-full absolute cursor-pointer"
            @click.prevent="notLoading()"></span>
        <div class="bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal p-6 max-w-[32rem] md:w-[91.666667%] font-SpaceGrotesk"
            style="margin: 0 auto;">
            <div class="w-full justify-center text-center">
                <h2 class="font-bold text-2xl">
                    Secure Your Vault.
                </h2>
                <form method="post" class="w-full rounded-2xl">
                    <input v-model="password" type="password" name="password" placeholder="Password"
                        class="w-full px-3 outline-1 h-[40px] md:h-[48px] border-[0.5px] border-[#fff]/40 text-white mt-5" />
                    <span class="text-left block mt-2">This encrypts your data. Keep it safe!</span>
                    <button type="submit"
                        class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-3 btn"
                        @click.prevent="submitPassword" @keyup.enter="">
                        <span>Submit</span>
                    </button>
                    <PasswordVerifyFeedback :form-feedback="formFeedback2" />
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { generateTree } from "./Merkle";
import { createPasskey, authPasskey } from "./AES";
import { encrypt, decrypt, generatePrivKey, generatePubKey } from "./ECC";
import { ethers } from "ethers";
import { hashPassword } from "./ParsePassword.js"

type piiType = {
    firstname: string;
    lastname: string;
    dob: string;
    country: string;
    sig: string;
}

type Schema = {
    "@context": string[];
    id: string;
    type: string[];
    issuer: string;
    issuanceDate: string;
    expirationDate: null;
    credentialSubject: {
        id: string;
        cred: {
            type: string;
            status: string;
            data: string;
            algorithm: string;
            verificationDate: string;
        };
    };
}

const firstname = ref("");
const lastname = ref("");
const dob = ref("");
const country = ref("");
const password = ref("");
const formFeedback = ref("");
const formFeedback2 = ref("");
const encrypting = ref(false);
const address = useCookie("address");
const privKey = generatePrivKey()
const publicKey = generatePubKey(privKey);

const config = useRuntimeConfig()

let piiArray: any[] = [];
let pii: piiType;
let zkSchema: Schema;

let zkHash;

const notLoading = () => {
    encrypting.value = false;
}

const generateRandomString = (length = 42): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random()
            * characters.length));
    }
    return result;
};

const deriveEthAddressFromKey = (privateKey: string): string => {
    const wallet = new ethers.Wallet(privateKey.toString().trim());
    return wallet.address;
}

// generates random strings to represent a 3d face recognition signature based on anima. similar to: 2SatKPaipypttoH7eNyPRF7YbVVF1MQctUNRgMZc5S
const faceSig = generateRandomString().toLowerCase();

const submitForm = () => {
    if (!(firstname.value.trim() && lastname.value.trim() && dob.value.trim() && country.value.trim())) {
        formFeedback.value = "incomplete";
        return;
    } else if (!(firstname.value.length >= 2 && lastname.value.length >= 2)) {
        formFeedback.value = "invalid";
        return;
    }
    formFeedback.value = "";
    encrypting.value = true;
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

const submitPassword = async () => {
    formFeedback.value = "";
    if (!password.value.trim()) {
        formFeedback2.value = "incomplete";
        return;
    } else if (!(password.value.length >= 8) || !(/^(?=.*[A-Z])/.test(password.value)) || !(/^(?=.*[a-z])/.test(password.value)) || !(/^(?=.*[0-9])/.test(password.value)) || !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password.value)) {
        formFeedback2.value = "invalid";
        return;
    }
    pii = {
        firstname: firstname.value,
        lastname: lastname.value,
        dob: dob.value,
        country: country.value,
        sig: faceSig
    }
    piiArray = getValuesFromObject(pii);
    
    
    zkHash = generateTree(piiArray);

    zkHash.then(async (tree) => {
        encrypt(publicKey, JSON.stringify(pii)).then(async (encryptedPii) => {
            
            // this is just a sample of what zkSchema would be like
            zkSchema = {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://0xzero.org/contexts/zkSchema/v1"
                ],
                "id": "urn:uuid:" + address.value,
                "type": ["VerifiableCredential", "ZERO-Credential"],
                "issuer": "did:zero:" + config.public.address,
                "issuanceDate": Date.toString(),
                "expirationDate": null,
                "credentialSubject": {
                    "id": "did:zero:" + tree.getHexRoot(),
                    "cred": {
                        "type": "zkyc",
                        "status": "verified",
                        "data": encryptedPii,
                        "algorithm": "aes",
                        "verificationDate": Date.toString()
                    }
                }
            }

            setTimeout(async () => {
                try {
                    
                    

                    const { data: response } = await useFetch("api/addUser", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: {
                            address: address,
                            pubkey: publicKey,
                            passwordEncr: hashPassword(password.value, privKey)
                        }
                    })

                    const res: Ref<any> = ref(response) as Ref<any>;

                    if (res.value.response == "error") {
                        formFeedback2.value = res.value.response;
                        return;
                    };

                    const { data: response2 } = await useFetch("api/addCred", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: {
                            address: tree.getHexRoot(),
                            data: zkSchema
                        }
                    })

                    const res2: Ref<any> = ref(response) as Ref<any>;

                    if (res2.value.response == "error") {
                        formFeedback2.value = res2.value.response;
                        return
                    };

                    const { data: response3 } = await useFetch("api/verify", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: {
                            address: address,
                            zkHash: tree.getHexRoot()
                        }
                    })

                    const res3: Ref<any> = ref(response) as Ref<any>;
                    res3.value.response.url ? formFeedback2.value = "success" : formFeedback2.value = "error";
                    if (formFeedback.value == "error") return;
                    reloadNuxtApp()
                } catch (error) {
                    formFeedback2.value = "error"
                }
            }, 300);
        });
    })
}

const checkChar = (str: string): boolean => {
    for (let i = 0; i < str.length; ++i) {
        let ch = str.charCodeAt(i);
        if (
            !(ch >= 65 && ch <= 90) && // A-Z
            !(ch >= 97 && ch <= 122) && // a-z
            !(ch >= 48 && ch <= 57) // 0-9
        ) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

const whitespaceToHyphen = (input: string): string => {
    return input.replace(/\s+/g, '-').toLowerCase();
}
</script>
