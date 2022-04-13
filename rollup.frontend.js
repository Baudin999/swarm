import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// import commonjs from '@rollup/plugin-commonjs';
// import replace from '@rollup/plugin-replace';


const config = {
    input: './components/Frontend.js',
    output: {
        file: 'dist/app.js',
        format: 'esm',
        sourcemap: true,
    },
    // external: [/@babel\/runtime/, 'react'],
    plugins: [
        nodeResolve({
            extensions: [".js"],
          }),
          // replace({
          //   'process.env.NODE_ENV': JSON.stringify( 'development' )
          // }),
          babel({
            babelHelpers: 'bundled',
            presets: ["@babel/preset-react", "@babel/preset-env"],
          }),
          // commonjs(),
        // rollupJson(),
        // shebang({
        //     include: 'swarm-cli/index.js'
        // }),
        // resolve({
        //     // pass custom options to the resolve plugin
        //     moduleDirectories: ['node_modules']
        // }),
        // commonjs()
    ]
};

export default config;
