import path, { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "^": path.resolve(__dirname, "./src/renderer"),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 }, // 激进压缩
        pngquant: { quality: [0.7, 0.9], speed: 4 },
        svgo: {
          plugins: [
            { name: "removeViewBox" },
            { name: "removeEmptyAttrs", active: false },
          ],
        },
      }),
    ],
    build: {
      sourcemap: false,
      minify: "esbuild", // 使用 terser 获得更小体积
      chunkSizeWarningLimit: 600,
    },
  },
});
