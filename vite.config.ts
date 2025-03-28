import tailwindcss from "@tailwindcss/vite";
import html from "@tomjs/vite-plugin-html";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		html({
			cdn: {
				modules: ["react", "react-dom"],
			},
		}),
	],
	esbuild: {
		drop: ["console", "debugger"], // https://esbuild.github.io/api/#drop
	},
});
