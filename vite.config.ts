import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const manualChunks = {
  vendor: ["react", "react-dom", "react-router-dom"],
  animations: ["framer-motion"],
  query: ["@tanstack/react-query"],
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appVersion = env.npm_package_version ?? process.env.npm_package_version ?? "0.0.0";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    preview: {
      host: "::",
      port: 8080,
    },
    envPrefix: ["VITE_", "MONYNHA_"],
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode === "development",
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      globals: true,
      css: true,
    },
  };
});
