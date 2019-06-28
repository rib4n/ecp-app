import Vue from "vue";
import App from "./App.vue";
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  data() {
    return {};
  },
  render: h => h(App)
});
