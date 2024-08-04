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
      secretKey: process.env.SUMSUB_SECRET_KEY,
      rpc: process.env.RPC,
      privateKey: process.env.PRIVATE_KEY,
      salt: process.env.SALT,
    },
  },
  $development: {
    vite: {
      define: {
        global: "globalThis",
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        crypto: "crypto-browserify",
        stream: "stream-browserify",
        assert: "assert",
        http: "stream-http",
        https: "https-browserify",
        os: "os-browserify",
        path: "path-browserify",
        process: "process/browser",
      },
    },
  },
});
