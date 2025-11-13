import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // QUAN TRỌNG: Thay 'ml-readme-viewer-63046d6a' bằng tên repository thực tế của bạn
  // Ví dụ: nếu repo là 'my-project' thì dùng '/my-project/'
  // Nếu deploy lên username.github.io (custom domain) thì để '/'
  base: process.env.GITHUB_PAGES ? '/ml-readme-viewer-63046d6a/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
