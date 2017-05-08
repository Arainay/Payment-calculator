module.exports = {
    entry: `./src/js/index.js`,
    output: {
        path: __dirname + `/dist/`,
        filename: `bundle.js`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /dist/],
                use: [{
                    loader: `babel-loader`,
                    options: { presets: [`es2015`] }
                }]
            }
        ]
    }
};