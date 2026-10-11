// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "@nuxt/eslint",
    "@vercel/analytics",
  ],
  css: ["~/assets/css/main.css"],
  site: {
    url: "https://qris-converter.abdusy.dev",
    title: "Ubah QRIS Statis Jadi Dinamis",
  },
});