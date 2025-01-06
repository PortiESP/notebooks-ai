import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr'

// const MODE = process?.env?.NODE_ENV


export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                // target: MODE === "development" ? "http://localhost:3000" : "https://notebooks-ai-backend-portiesp-portis-projects.vercel.app",
            },
        },
    },
})