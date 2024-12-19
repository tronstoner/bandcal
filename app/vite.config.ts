import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
    extensions: [".js", ".ts", ".vue"],
  },
  server: {
    host: "0.0.0.0", // Ensure the server is accessible externally
    port: 8081, // Vite's default dev server port
    hmr: {
      host: "localhost", // The host where the HMR server is running
      port: 8080, // The port where Nginx is listening
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000", // API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
