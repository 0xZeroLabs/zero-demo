<template>
    <div class="min-h-[calc(100vh-216px)] flex items-center font-SpaceGrotesk">
        <Head>
            <title>ZΞRO Demo</title>
        </Head>

        <div class="w-full">
            <div class="w-full flex justify-center items-center flex-col">
                <div class="block">
                    <label for="proof" class="">
                        <span>Click or drag proof file to this area.</span>
                        <span>{{ fileName }}</span>
                    </label>
                    <input type="file" name="proof" id="proof" class="" accept=".json" v-on:change="checkFile"
                        v-on:dragenter="dragenter" v-on:dragover="dragover" v-on:drop="drop" />
                </div>
                <div class="w-64 md:w-80 ">
                    <button type="submit"
                        class="w-full h-[40px] md:h-[48px] border-[0.5px] border-[#fff] text-white mt-6 btn"
                        @click.prevent="submit" :disabled="false">
                        <span v-if="isLoading" class="load">Verifying..</span>
                        <span v-else>Submit Proof</span>
                    </button>
                </div>
                <span class="mt-4 max-w-[90%] text-center">{{ data }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const fileName = ref("");
const data = ref("");
const isLoading = ref(false)

const fileData = ref<any>();

const checkFile = (e: any) => {
    
    const [file] = e.target!.files;
    const { name: fileN, size } = file;

    const fileSize = (size / 1000).toFixed(2);
    const fileNameAndSize = `${fileN} - ${fileSize}KB`;
    fileName.value = fileNameAndSize;

    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);
}

const onReaderLoad = (e: any) => {
    try {
        fileData.value = getArraysFromObject(JSON.parse(e.target.result));
        data.value = "";
    } catch (error) {
        data.value = "Please provide a valid json file!";
    }

    
}

const dragenter = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
}

const dragover = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
}

const drop = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(e)

    checkFile(e);
}

const getArraysFromObject = (jsonObject: { [key: string]: any }): any[] => {
    const values: any[] = [];

    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            const value = jsonObject[key];

            values.push(value)
        }

    }

    return values;
}

const submit = async () => {
    if (fileData.value.length == 4) {
        isLoading.value = true;
        setTimeout(async () => {
            const { data: response } = await useFetch("api/verifyProof", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    proof: fileData.value,
                }
            });

            const res = ref(response) as Ref;

            if (res.value.response == true) {
                (fileData.value[3][2] != 0)? data.value = `This person is up to the age of ${fileData.value[3][0]}.` : data.value = `This person is less than the age of ${fileData.value[3][0]}.`;
            } else {
                data.value = "This proof is invalid."
            }
            isLoading.value = false;
        }, 300);
    } else data.value = "Please provide a valid proof file!"
}
</script>

<style scoped>
input[type="file"] {
    display: none;
}

label {
    @apply relative w-64 md:w-80 h-24 flex flex-col items-center justify-center rounded border-[0.5px] border-[#fff] text-white;

    * {
        @apply text-white z-10 relative text-center;
    }
}

label::before {
    content: "";
    @apply bg-[#080808]/80 absolute top-[8px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%-16px)];
}

label:after {
    content: "";
    @apply bg-[#080808]/80 absolute left-[8px] z-0 top-[-2px] h-[calc(100%+4px)] w-[calc(100%-16px)];
}
</style>