"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require("cross-spawn");
const path_1 = require("path");
import {init} from "./lib/init";
import {resolveLoader as loader} from "./lib/loader";
import {spawnPromise} from "./lib/spawnPromise";
const extRe = /\.tsx?$/;
export function fastTscPlugin(opts = {}) {
    const { extraCliArgs = [], mainPath = process.cwd(), tsconfig, watch = false } = opts;
    let tmpDirPath;
    // let cfg: ts.ParsedCommandLine;
    let loaderFn;
    const args = [
        require.resolve('typescript/bin/tsc'),
        ...extraCliArgs,
        '--outDir'
    ];
    let done = init.init(mainPath, tsconfig)
        .then(({ dir, config }) => {
        loaderFn = loader.resolveLoader(extraCliArgs.includes('--sourceMap') || config.options.sourceMap);
        args.push(tmpDirPath = dir);
        return spawnPromise.spawnPromise(process.execPath, args);
    });
    if (watch) {
        // false positive - caught below
        done = done //tslint:disable-line:no-floating-promises
            .then(() => {
            // Don't return
            spawn(process.execPath, args.concat('--watch', '--preserveWatchOutput'));
        });
    }
    done
        .catch(() => {
        // noop - will be handled in buildStart
    });
    return {
        buildStart() {
            return done;
        },
        load(id) {
            if (!extRe.test(id)) {
                return null;
            }
            const newId = path_1.join(tmpDirPath, path_1.relative(process.cwd(), id))
                .replace(extRe, '.js');
            watch && this.addWatchFile(newId);
            return loaderFn(newId);
        },
        name: 'fast-tsc'
    };
}
