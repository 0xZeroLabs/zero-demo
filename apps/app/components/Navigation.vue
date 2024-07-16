<template>
    <button @focus="toggleWaitlistState" class="fixed z-20 w-screen h-screen bg-none" :class="waitlistState"></button>
    <button @focus="toggleMenuState" class="fixed z-20 w-screen h-screen bg-none" :class="menuState"></button>
    <div
        class="bg-[#000]/80 backdrop-blur-sm w-full h-[80px] flex justify-center items-center fixed top-0 border-[#111111]/80 border-b z-20">
        <div
            class="z-[999] flex flex-row justify-between items-center px-5 md:px-10 w-[97%] md:max-w-[1536px] text-white">
            <ul
                class="bg-[#111111]/80 backdrop-blur-sm hidden md:flex flex-row justify-evenly items-center gap-2 font-SpaceGrotesk font-light capitalize text-md w-[512px] h-[40px] rounded-md border">
                <li><a href="/#" class="nav-link">Ecosystem</a></li>
                <li><a href="/#solutions" class="nav-link">Solutions</a></li>
                <li><a href="/#" class="nav-link">Token</a></li>
                <li><a href="/#" class="nav-link">About</a></li>
                <li><a href="/#" class="nav-link">Contact</a></li>
            </ul>

            <div class="flex">
                <button @click="toggleWaitlistState"
                    class="w-[140px] md:w-[168px] h-[40px] md:h-[48px] border-[0.5px] border-[#fff] btn">
                    <span class="">Join Waitlist</span>
                </button>
            </div>
        </div>
        <div class="absolute w-[97%] md:max-w-[1536px]" :class="waitlistState">
            <Waitlist />
        </div>
        <div class="absolute w-[97%] md:max-w-[1536px] z-30" :class="menuState">
            <Menu />
        </div>
    </div>
</template>
<script setup lang="ts">
let waitlistState = ref("hidden")
const toggleWaitlistState = () => {
    if (waitlistState.value == "hidden") {
        waitlistState.value = "fade-in"
    } else {
        waitlistState.value = "hidden"
    }
}
</script>