import axios from 'axios'
import { Message } from 'element-ui';
import router from '../router/'
import { baseUrl, baseUrlChain } from './baseUrl';
import api from '../api/api'
// 响应拦截器
axios.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    // 请求失败
    error => {
        const { response } = error;
        if (response) {
            if (response.status === 302) {
                // Message.error('token失效，请重新登陆');
                router.push('/login');
                api.clearLS();
            }
        } else {
            Message.error('请求失败，请稍后再试');
        }
    }
);
export default function http(urls, data = {}, method = 'post', tag = '') {
    let userInfo = localStorage.getItem('userInfo');
    let token = '';
    if (userInfo) {
        token = JSON.parse(userInfo).token;
    }
    let defaultOptions = {
        method,
        timeout: 1000 * 20,
        url: tag === 'chain' ? `${baseUrlChain}${urls}` : `${baseUrl}${urls}`,
        // url: `${baseUrl}${urls}`,
        params: method === 'get' ? data : {},
        data,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Token": token,
            "Product": "Gov"
        },
    }
    if (method === 'get') {
        delete defaultOptions.data
    } else {
        delete defaultOptions.params
    }
    if (tag === 'chain') {
        //     delete defaultOptions.headers.Token
        // defaultOptions.headers.Product = "Gov"
          }

      
    return axios(defaultOptions)
}