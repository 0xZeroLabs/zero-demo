// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
  css: ["~/assets/scss/main.scss"],
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
  colorMode: {
    preference: "dark",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },
  runtimeConfig: {
    public: {
      accessToken: process.env.SUMSUB_ACCESS_TOKEN,
      userID: process.env.SUMSUB_USER_ID,
      appToken: process.env.SUMSUB_APP_TOKEN,
      secretKey: process.env.SUMSUB_SECRET_KEY
    }
  }
})