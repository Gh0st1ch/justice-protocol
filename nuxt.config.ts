export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  compatibilityDate: '2024-07-01',
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  css: ['~/assets/css/main.css'],
  
})