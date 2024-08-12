import { nodePolyfills } from "vite-plugin-node-polyfills";
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
    privateKey: process.env.PRIVATE_KEY,
    accessToken: process.env.SUMSUB_ACCESS_TOKEN,
    appToken: process.env.SUMSUB_APP_TOKEN,
    secretKey: process.env.SUMSUB_SECRET_KEY,
    public: {
      userID: process.env.SUMSUB_USER_ID,
      rpc: process.env.RPC,
      salt: process.env.SALT,
      scope: process.env.SCOPE_ID,
      address: process.env.ADDRESS,
    },
  },
  vite: {
    define: {
      global: "globalThis",
    },

    plugins: [
      {
        // work around for `exports is not defined` error within the crypto-browserify > randomfill dep
        name: "crypto-randomfill-patch",

        apply: "build",
        enforce: "pre",

        renderChunk(code, chunk) {
          if (!/randomfill.*\.js$/.test(chunk.fileName)) {
            return null;
          }

          console.log("🟪 Patching crypto randomfill dep");

          const modifiedCode = code
            .split("\n")
            .map((line) => {
              if (line.trim() === "exports.randomFill = randomFill;") {
                return "var exports = {}; exports.randomFill = randomFill;";
              }

              return line;
            })
            .join("\n");

          return { code: modifiedCode, map: null };
        },
      },
      nodePolyfills({})
    ],

    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // isolate randomfill as a separate chunk
            if (id.includes("node_modules/randomfill/browser.js")) {
              return "randomfill";
            }
          },
        },
      },
    },
  },
});
