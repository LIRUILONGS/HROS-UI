let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8083"
};

proxyObj['/'] = {
    target: 'http://localhost:8083',
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