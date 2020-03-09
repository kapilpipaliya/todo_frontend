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
import findFreePort from 'find-free-port-sync'
let liveport = findFreePort({
    start: 35000,
    end: 36000,
    num: 1,
    ip: 'localhost'
})
console.log(liveport)
const hash = Date.now()

const extensions = [".ts", ".js"]

const mode = process.env.NODE_ENV;

let dest = "./dist"
let entry = "src/index.ts"
if(process.env.V == "micro"){
  dest = `./dist${process.env.V}`
  entry = `src/index${process.env.V}.ts`
} else if (process.env.V == "mini") {
  dest = `./dist${process.env.V}`
  entry = `src/index${process.env.V}.ts`
}
require('child_process').spawn('rm', ['-rf', dest], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        })

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
    template: "index.html",
    dest,
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
    livereload({ port: liveport, watch: dest })
  );
} else {
  plugins.push(terser({ sourcemap: true }))
}

module.exports = {
  input: entry,
  output: {
    //file: "dist/index.js",
    sourcemap: true,
    format: "iife",
    name: 'oktech',
    file: `${dest}/index.${hash}.js`,
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

        require('child_process').spawn('yarn', ['sirv', dest, '--single', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  };
}