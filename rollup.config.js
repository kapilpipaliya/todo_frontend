import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
//import serve from "rollup-plugin-serve" // use my own serve function
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


//import html from "rollup-plugin-bundle-html"
import replaceInFile from 'replace-in-file'
import path from 'path'
import fs from 'fs'


const liveport = findFreePort({
    start: 35000,
    end: 36000,
    num: 1,
    ip: 'localhost'
})
let isLiveReload = true
if(process.env.live == "no"){
  isLiveReload = false
}

const extensions = [".ts", ".js"]

const mode = process.env.NODE_ENV;

let dest = process.env.NODE_ENV === "development" ? "./dist" : "./distrel"
let entry = "src/index.ts"
if(process.env.V == "micro"){
  dest = `./dist${process.env.V}`
  entry = `src/test/index${process.env.V}.ts`
} else if (process.env.V == "mini") {
  dest = `./dist${process.env.V}`
  entry = `src/test/index${process.env.V}.ts`
}
require('child_process').spawn('rm', ['-rf', dest], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        })

// const hash = crypto.createHash('md5').update(pkg.version).digest("hex").substr(0, 7);
const hash = Date.now()
// file: `public/bundles/bundle-${hash}.js`
// Date.now()
let htmlDone = false;
const generateHtmlBuild = (options) => {
    return {
        async generateBundle(){
            if (htmlDone) return;
            const targDir = path.dirname(options.targ);
            if (!fs.existsSync(targDir)){
                fs.mkdirSync(targDir);
            }
            fs.writeFileSync(options.targ, fs.readFileSync(options.src));
            const replaceOptions = {
                files: options.targ,
                from: /REPLACE_HASH/g,
                to: hash,
            };
            try {
                const results = await replaceInFile(replaceOptions)
                console.log('Replacement results:', results);
                htmlDone = true;
            }
            catch (error) {
                console.error('Error occurred:', error);
            }
        }
    };
};



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
  // html({
  //   template: "index.html",
  //   dest,
  //   filename: "index.html",
  //   absolute: true
  // }),
  generateHtmlBuild({
    src:  'index.html',
    targ: `${dest}/index.html`
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
  );
    // Watch the `dist` directory and refresh the
    // browser on changes when not in production
  if(isLiveReload) plugins.push(livereload({ port: liveport, watch: dest }))
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