import { defineConfig } from "vite"; // We use the core Vite import for better compatibility
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // This defines the variable to fix the "not defined" error from earlier
  define: {
    '__BUNDLED_DEV__': JSON.stringify(true),
  },
  // We use @ts-ignore so Vitest doesn't complain about the 'test' key 
  // while using the standard Vite defineConfig
  // @ts-ignore
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});