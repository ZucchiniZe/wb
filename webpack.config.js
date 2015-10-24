module.exports = {
    entry: __dirname + '/public/js/src/index.js',
    output: { path: __dirname + '/public/js', filename: 'bundle.js'},
    module: {
        loaders: [
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }
        ]
    }
}
