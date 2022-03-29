import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import shebang from 'rollup-plugin-add-shebang';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import css from "rollup-plugin-import-css";
import copy from "rollup-plugin-copy-assets";


const config = {
    input: './index.js',
    output: {
        file: 'output/index.js',
        format: 'cjs',
    },
    external: [/@babel\/runtime/, 'react'],
    plugins: [
        css(),
        replace({
            "process.env.NODE_ENV": JSON.stringify("development"),
            "preventAssignment": false
        }),

        babel({
            exclude: "node_modules/**",
            babelHelpers: 'runtime',
            plugins: [
                '@babel/plugin-transform-runtime'
            ]
        }),
        rollupJson(),
        shebang({
            include: 'output/index.js'
        }),
        resolve({
            // pass custom options to the resolve plugin
            moduleDirectories: ['node_modules']
        }),
        commonjs(),
        copy({
            assets: [
                "styles",
                "components"
            ]
        })
    ]
};

export default config;
