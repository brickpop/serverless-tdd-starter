const slsw = require('serverless-webpack');

const config = {
    entry: slsw.lib.entries,
    target: 'node',
    mode: slsw.lib.webpack.isLocal ? "development" : "production"
}

module.exports = config
