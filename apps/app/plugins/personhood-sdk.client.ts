import { defineNuxtPlugin } from "#app";

import PersonhoodSdk from "@anima-protocol/personhood-sdk-vue/dist/personhood-sdk-vue.es";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PersonhoodSdk);
});