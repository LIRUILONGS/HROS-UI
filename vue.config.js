let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8082"
};

proxyObj['/'] = {
    target: 'http://localhost:8082',
    ws: false,
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: '127.0.0.1',
       
        proxy: proxyObj,
       
    }


}