import buble from 'rollup-plugin-buble';
import alias from 'rollup-plugin-alias';

const path = require('path');

export default {
    input: "test.js",
    output: {
        file: "example/test.min.js",
        format: "iife",
        name : 'Streamedian',
        sourcemap:true
    },



    entry: path.join(__dirname, 'example.js'),
    targets: [
        {dest: path.join(__dirname, 'example/streamedian.js'), format: 'umd'}
    ],
    sourceMap: true,
    plugins: [
        // uncomment if you want to transpile into es5
        //buble({
            //exclude: 'node_modules/**'
        //}),
        alias({
            bp_logger: path.join(__dirname,'node_modules/bp_logger/logger'),
            bp_event: path.join(__dirname,'node_modules/bp_event/event'),
            bp_statemachine: path.join(__dirname,'node_modules/bp_statemachine/statemachine'),
            wsp: path.join(__dirname,'node_modules/html5_rtsp_player/src')
        })
    ]

}