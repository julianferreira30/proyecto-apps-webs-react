import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7158,
    proxy: {
      "/api": {
        target: "http://localhost:7113",
        changeOrigin: true,
      },
    },
  },
});
