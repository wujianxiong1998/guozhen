var path = require('path');

export default {
    "entry": "src/index.js",
    "html": {
        "template": "./public/index.ejs"
    },
    "proxy": {
        "/cloud/management": {
            // "target": "http://103.14.132.101:8003/",//生产环境
            // "target": "http://192.168.1.207:8003/", //测试环境
            // "target": "http://192.168.11.127:18001/", //周游
            "target": "http://192.168.11.120:18001/", //王超
            "changeOrigin": true
        },
        "/cloud/gzzhsw": {
            // "target": "http://103.14.132.101:8003/",//生产环境
            // "target": "http://192.168.1.207:8003/", //测试环境
            // "target": "http://10.10.10.91:18001/", //张翰翔
            // "target": "http://10.10.11.62:18002/", //朱锐
            // "target": "http://192.168.11.127:18001/", //周游
            "target": "http://192.168.11.120:18001/", //王超
            // "changeOrigin": true
        },
        "/cloudFile": {
            "target": "http://192.168.1.207:18082",
            "changeOrigin": true
        },
        "/vortex/rest": {
            "target": "http://192.168.1.207:8003",
            "changeOrigin": true
        },
    },
    "extraBabelPlugins": [
        ["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": "css" }, "antd"],
        ["import", { "libraryName": "vtx-ui", "camel2DashComponentName": false }, "vtx-ui"],
        ["import", { "libraryName": "lodash", "libraryDirectory": "", "camel2DashComponentName": false }, "lodash"]
    ],
    "hash": true,
    commons: [{
        async: "common",
        children: true,
        minChunks: 5
    }, {
        async: "echarts",
        children: true,
        minChunks: function (module, count) {
            return /echarts/.test(module.context);
        }
    }, {
        async: "lodash",
        children: true,
        minChunks: function (module) {
            return /lodash/.test(module.context);
        }
    }, {
        async: "moment",
        children: true,
        minChunks: function (module) {
            return /moment/.test(module.context);
        }
    }, {
        name: "manifest",
        minChunks: "Infinity"
    }],
    alias: {
        history: path.dirname(require.resolve('history/package.json')),
        moment: path.dirname(require.resolve('moment/package.json'))
    },
    "env": {
        "development": {
            "extraBabelPlugins": [
                "dva-hmr"
            ]
        },
        "production": {
            "extraBabelPlugins": [
                "transform-remove-console"
            ]
        }
    }
}
