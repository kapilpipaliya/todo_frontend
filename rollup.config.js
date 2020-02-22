import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
//import serve from "rollup-plugin-serve" // use my own serve function
import html from "rollup-plugin-bundle-html"
//import css from "rollup-plugin-css-porter" // now use postcss
import postcss from "rollup-plugin-postcss"
import typescript from "rollup-plugin-typescript2"
import typescriptCompiler from "typescript"
import { terser } from "rollup-plugin-terser"
import livereload from "rollup-plugin-livereload"
import sveltePreprocessor from "svelte-preprocess"
import analyze from 'rollup-plugin-analyzer'
import replace from '@rollup/plugin-replace';
import { compress } from 'brotli'
import gzipPlugin from 'rollup-plugin-gzip'
const hash = Date.now()

const extensions = [".ts", ".js"]

const mode = process.env.NODE_ENV;

const plugins = [
  //analyze(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(mode)
  }),
  svelte({
    dev: process.env.NODE_ENV === "development",
    extensions: [".svelte"],
    preprocess: sveltePreprocessor(),
    emitCss: true,
  }),
  html({
    template: "src/index.html",
    dest: "dist",
    filename: "index.html",
    absolute: true
  }),
  postcss({
    extract: true
  }),
  resolve({
          browser: true,
          dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
          extensions
  }),
  commonjs({ include: "node_modules/**" }),
  typescript({ typescript: typescriptCompiler }),
  gzipPlugin({
      customCompression: content => compress(Buffer.from(content)),
      fileName: '.br',
  }),
];

if (process.env.NODE_ENV === "development") {
  plugins.push(
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    serve(),
    // Watch the `dist` directory and refresh the
    // browser on changes when not in production
    livereload({ watch: "./dist" })
  );
} else {
  plugins.push(terser({ sourcemap: true }))
}

module.exports = {
  input: "src/index.ts",
  output: {
    //file: "dist/index.js",
    sourcemap: true,
    format: "iife",
    file: `dist/index.${hash}.js`,
    //dir: 'public/build/',
    //entryFileNames: "[name].[hash].js",
  },
  plugins
}

// copied from official template
function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  };
}