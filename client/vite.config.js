import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
      id: '',
      name: "Emedoc",
      short_name: "Emedoc",
      description: "An app that can show weather forecast for your city.",
      icons: [
          {
              src: "/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
          },
          {
              src: "/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
          },
          {
              src: "/apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "apple touch icon",
          },
          {
              src: "/maskable_icon.png",
              sizes: "225x225",
              type: "image/png",
              purpose: "any maskable",
          },
      ],
      theme_color: "#171717",
      background_color: "#e8ebf2",
      display: "standalone",
      scope: "/",
      start_url: "/",
      orientation: "portrait",
      resolve: {
        alias: {
          '@': '/src', // Adjust the path based on your project structure
        },
      }
  },
};

// http://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), VitePWA(manifestForPlugin)],
  server:{
    host: "0.0.0.0",
    proxy:{
      '/api':{
        target:'https://final-fyp.onrender.com',
        changeOrigin: true, 
        secure: true, 
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
