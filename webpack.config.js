var webpack = require('webpack');
var CSSSplitWebpackPlugin = require('css-split-webpack-plugin/dist/index').default;
var historyDir = require('path').dirname(require.resolve('history/package.json'),);
var rcTreeDir = require('path').dirname(require.resolve('rc-tree-select'),);
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = function(webpackConfig, env) {
// adding plugins to your configuration
    webpackConfig.plugins.push(
        new CSSSplitWebpackPlugin({
            size: 3000,
        })
    )
    // 锁定版本
    webpackConfig.resolve.alias['history'] = historyDir;
    webpackConfig.resolve.alias['rc-tree-select'] = rcTreeDir;
    if (process.env.NODE_ENV == 'production') {
        // 代码压缩
        webpackConfig.plugins = webpackConfig.plugins.filter(function (plugin) {
            return !(plugin instanceof webpack.optimize.UglifyJsPlugin);
        });
        webpackConfig.plugins.push(new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    comments: false,
                    ascii_only: true
                },
                warnings: false,
            },
            cacheDir: './.cache'
        }));

        // 打包分析工具
        // webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }
    return webpackConfig
}
