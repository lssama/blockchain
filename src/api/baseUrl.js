// const hostname = window.location.hostname

let baseUrl, baseUrlChain; //center   agent
// 环境切换
if (process.env.NODE_ENV == 'development') {
    baseUrl = "http://172.16.0.101:8080/v1";
    baseUrlChain = "http://172.16.0.101:8180/v1";
    // baseUrl = "http://106.75.73.34:8080/v1";
    // baseUrlChain = "http://106.75.73.34:8180/v1";
} else if (process.env.NODE_ENV == 'production') {
    const hostname = window.location.hostname
    baseUrl = `http://${hostname}:31070/v1`;
    baseUrlChain = `http://${hostname}:32008/v1`

    // test
    // baseUrl = `http://api.switch-center.zsbatech.com/v1`;
    // baseUrlChain = `http://api.switch-agent.zsbatech.com/v1`

    // baseUrlChain = `http://106.75.22.174:8180/v1`
}

module.exports = {
    baseUrl,
    baseUrlChain,
}