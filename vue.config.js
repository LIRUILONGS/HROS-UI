let proxyObj = {};
proxyObj['/'] = {
    target: 'http://localhost:8081',
    ws: false,
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        proxy: proxyObj
    }


}