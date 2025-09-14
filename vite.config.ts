import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// import basicSsl from '@vitejs/plugin-basic-ssl';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // https: true,
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      'c2e9a020dfe0.ngrok-free.app' // ✅ ใส่ host ngrok ที่คุณได้มา
    ]
  },

 
  plugins: [ react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
