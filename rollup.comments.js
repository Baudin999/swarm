import { babel } from '@rollup/plugin-babel';
// import commonjs from '@rollup/plugin-commonjs';
// import replace from '@rollup/plugin-replace';


const config = {
    input: './components/Comments.js',
    output: {
        file: 'dist/comments.js',
        format: 'esm',
        sourcemap: true,
    },
    // external: [/@babel\/runtime/, 'react'],
    plugins: [
        // nodeResolve({
        //     extensions: [".js"],
        //   }),
          // replace({
          //   'process.env.NODE_ENV': JSON.stringify( 'development' )
          // }),
          babel({
            babelHelpers: 'bundled',
            presets: ["@babel/preset-react"],
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
