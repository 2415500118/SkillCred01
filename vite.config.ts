import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  
  const plugins = [react()];
  
  // Only add lovable-tagger in development
  if (isDevelopment) {
    try {
      const { componentTagger } = require("lovable-tagger");
      plugins.push(componentTagger());
    } catch (error) {
      // Silently fail if lovable-tagger is not available
      console.warn("lovable-tagger not available");
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8081
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Ensure proper build optimization for production
    build: {
      rollupOptions: {
        external: isDevelopment ? [] : ['lovable-tagger'],
        // Additional safeguards for production
        ...(isDevelopment ? {} : {
          onwarn(warning, warn) {
            // Suppress warnings about lovable-tagger in production
            if (warning.code === 'UNRESOLVED_IMPORT' && warning.message?.includes('lovable-tagger')) {
              return;
            }
            warn(warning);
          }
        })
      },
      // Additional production optimizations
      minify: !isDevelopment,
      sourcemap: isDevelopment,
      // Ensure clean production build
      emptyOutDir: true,
    },
    // Define environment variables
    define: {
      __DEV__: isDevelopment,
    },
    // Optimize dependencies
    optimizeDeps: {
      exclude: isDevelopment ? [] : ['lovable-tagger'],
    },
  };
});
