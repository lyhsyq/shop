import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

// 引入elementui
import ElementUI from 'element-ui';
// 引入elementui css
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';

// 安装elementui
Vue.use(ElementUI);

// 通过defaults的给axios设置一个默认的baseURL，在所有请求中都可以用到这个地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

// 设置axios的请求拦截器
axios.interceptors.request.use(function(config) {
	// console.log(config)
	config.headers.Authorization = localStorage.getItem('token');
	return config;
});

// 设置axios的响应拦截器
axios.interceptors.response.use(function(response) {
	// Do something with response data
	// console.log(11111111111111, response);
	if (response.data.meta.status === 401) {
		router.push('/login');
	}
	return response;
});

// 将axios添加到Vue的原型上
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
	if (to.path === '/login') {
		next();
	}

	if (localStorage.getItem('token')) {
		next();
	} else {
		router.push('/login');
	}
});
new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app');
