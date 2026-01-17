import { defineConfig } from "tsup";
import pkg from "./package.json";

/**
 * Export tsup configuration
 */
export default defineConfig({
    entry: ["src/index.ts", "src/cli/index.ts"],
    format: ["cjs", "esm"], // Build for cjs and esm
    dts: true, // Generate declaration file (.d.ts)
    splitting: false,
    sourcemap: true,
    clean: true,
	// Externalize all dependencies
	// This automatically keeps the bundle lean by not including
	// dependencies that the host app should provide
	external: [
		// ...Object.keys(pkg.dependencies || {}),
		// ...Object.keys(pkg.peerDependencies || {}),
	],
});
