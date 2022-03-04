const ClosurePlugin = require('closure-webpack-plugin');
 
module.exports = {
    target: "webworker",
    entry: "./index.js",
    mode: "production",
    optimization: {
    minimizer: [
        new ClosurePlugin({mode: 'STANDARD'}, {})
    ]
    }
};
