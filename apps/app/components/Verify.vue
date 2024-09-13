<script lang="ts" setup>
import snsWebSdk from '@sumsub/websdk';

const sumsubT = useCookie("sumsubT", {
    maxAge: 300,
});

const launchWebSdk = async (accessToken: string) => {
    let snsWebSdkInstance = snsWebSdk
        .init(
            accessToken,
            async () => await getAccessToken()
        )
        .withConf({
            lang: "en",
            theme: "dark",
        })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        // see below what kind of messages WebSDK generates
        .on("idCheck.onStepCompleted", (payload) => {
            
        })
        .on("idCheck.onError", (error) => {
            
        })
        .build();

    // you are ready to go:
    // just launch the WebSDK by providing the container element for it
    snsWebSdkInstance.launch("#sumsub-websdk-container");
}

const getAccessToken = async () => {
    try {
        const response = await fetch("api/sumsub", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        return data.response;
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    if (!sumsubT.value) sumsubT.value = await getAccessToken();
    
    await launchWebSdk(sumsubT.value as unknown as string)
})
</script>

<template>
    <div class="w-full h-full" id="sumsub-websdk-container"></div>
</template>