import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import * as fs from 'fs';
import * as path from 'path';

// Ships the design guidelines inside the npm package so consumers' coding agents can read them
// from node_modules/@true-tech-team/ui-components/guidelines/ (llms.txt sits at the package root).
function copyGuidelines(): Plugin {
  return {
    name: 'copy-guidelines',
    apply: 'build',
    closeBundle() {
      const src = path.join(__dirname, 'guidelines');
      const out = path.join(__dirname, 'dist');
      fs.cpSync(src, path.join(out, 'guidelines'), { recursive: true });
      fs.copyFileSync(path.join(src, 'llms.txt'), path.join(out, 'llms.txt'));
    },
  };
}

export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default;
  return {
    root: __dirname,
    cacheDir: 'node_modules/.vite',
    plugins: [
      react(),
      dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
      copyGuidelines(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' as const,
        },
      },
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: 'src/index.ts',
        name: 'ui-components',
        fileName: 'index',
        // Change this to the formats you want to support.
        // Don't forget to update your package.json as well.
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        // External packages that should not be bundled into your library.
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          // Vite/Rollup strips directive prologues (like the 'use client' at the
          // top of src/index.ts) from library builds, which breaks consumers on
          // React Server Components frameworks (Next.js App Router) - every
          // component here is client-only, so restore it unconditionally.
          banner: "'use client';",
        },
      },
    },
  };
});
