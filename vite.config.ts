import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // o three.js só carrega sob demanda (React.lazy no hero), então o tamanho do chunk não pesa na abertura
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap", "lenis"],
        },
      },
    },
  },
});
