import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';


const config = {
    input: './index.js',
    output: {
        dir: 'output'
    },
    plugins: [
        commonjs(),
        babel({ babelHelpers: 'bundled' })
    ]
};

export default config;
