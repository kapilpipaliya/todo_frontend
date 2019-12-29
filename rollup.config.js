import svelte from "rollup-plugin-svelte"
import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
//import serve from "rollup-plugin-serve"
import html from "rollup-plugin-bundle-html"
import css from "rollup-plugin-css-porter"
import typescript from "rollup-plugin-typescript2"
import typescriptCompiler from "typescript"
import { terser } from "rollup-plugin-terser"
import livereload from "rollup-plugin-livereload"
import sveltePreprocessor from "svelte-preprocess"

const plugins = [
  svelte({
    dev: process.env.NODE_ENV === "development",
    extensions: [".svelte"],
    preprocess: sveltePreprocessor(),
  }),
  html({
    template: "src/index.html",
    dest: "dist",
    filename: "index.html"
  }),
  css({
    dest: 'dist/index.css',
    raw: false
  }),
  typescript({ typescript: typescriptCompiler }),
  commonjs({ include: "node_modules/**" }),
  resolve()
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
    file: "dist/index.js",
    sourcemap: true,
    format: "iife"
  },
  plugins
}

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