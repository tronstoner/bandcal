import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("ENV", env);
  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [vue()],
    resolve: {
      alias: {
        "@": "/src",
      },
      extensions: [".js", ".ts", ".vue"],
    },
    server: {
      host: "0.0.0.0", // Ensure the server is accessible externally
      port: Number(env.VITE_PORT || "8081"), // Vite's default dev server port
      hmr: {
        host: "localhost", // The host where the HMR server is running
        port: Number(env.VITE_PORT || "8081"), // The port where Nginx is listening
        clientPort: Number(env.BANDCAL_PORT || "8080"), // Ensure the client connects to the correct port
        path: `${env.VITE_BASE_PATH || "/"}__hmr`, // Include base path in HMR client URL
      },
    },
  };
});
