<template>
    <div class="bg-[#080808] border-[0.5px] rounded border-[#fff]/80 modal p-6 max-w-[32rem] md:w-[91.666667%] font-SpaceGrotesk"
        style="margin: 0 auto;">
        <div class="w-full justify-center text-center">
            <h2 class="font-bold text-2xl">
                Verify your Identity.
            </h2>
            <form method="post" class="w-full rounded-2xl">
                <div class="w-full flex justify-between">
                    <input v-model="fisrtname" type="text" name="fisrtname" placeholder="First Name"
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
                    @click.prevent="submit" @keyup.enter="">
                    <span>Submit</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { generateTree } from "./Merkle";

type piiType = {
    firstname: string;
    lastname: string;
    dob: string;
    country: string;
    sig: string;
}

const fisrtname = ref("");
const lastname = ref("");
const dob = ref("");
const country = ref("");

let piiArray: any[] = [];
let pii: piiType;

let zkHash;

const generateRandomString = (length = 42): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random()
            * characters.length));
    }
    return result;
};

// generates random strings to represent a 3d face recognition signature based on anima. similar to: 2SatKPaipypttoH7eNyPRF7YbVVF1MQctUNRgMZc5S
const faceSig = generateRandomString().toLowerCase();

const submit = () => {
    pii = {
        firstname: fisrtname.value,
        lastname: lastname.value,
        dob: dob.value,
        country: country.value,
        sig: faceSig
    }
    piiArray = getValuesFromObject(pii);
    console.log(piiArray)
    zkHash = generateTree(piiArray);
    zkHash.then((tree) => {
        console.log(tree.getHexRoot());
    });
}

function getValuesFromObject(jsonObject: { [key: string]: any }): any[] {
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