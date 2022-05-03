const path = require('path');

module.exports = {
    entry: './src/main.js',
    mode: 'production',
    target: 'es5',
    output: {
        filename: 'main.js',
        chunkFormat: 'commonjs',
        path: path.resolve(__dirname, 'bin'),
    },
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]  
                    }
                }
            },
        ]
    }
}