import { defineConfig } from "vite";

export default defineConfig({
  root: "src", // Set 'src' as the root folder
  publicDir: "../static", // Store public assets outside 'src'
  base: "./", // Use relative paths (important for GitHub Pages)

  build: {
    outDir: "../dist", // Output 'dist' in the project root
    emptyOutDir: true, // Clears old files before each build
    chunkSizeWarningLimit: 800, // Adjust chunk size warning threshold
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "three"; // Separate Three.js
            return "vendor"; // Separate other dependencies
          }
        },
      },
    },
  }
});
