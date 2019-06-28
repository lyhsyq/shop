import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 引入elementui
import ElementUI from "element-ui";
// 引入elementui css
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/index.css";

// 安装elementui
Vue.use(ElementUI)

Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path === "/") {
    router.push("/login");
  }

  if (to.path === "/login") {
    next();
  }

  if (localStorage.getItem("token")) {
    next()
  } else {
    router.push("/login")
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
