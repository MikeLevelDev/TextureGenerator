import Vue from "vue";
import App from "./App.vue";
//import { getTextures } from "./lib/blocks";
import blocks from "../static/blocks-list.json";
import "vue-json-pretty/lib/styles.css";

Vue.config.productionTip = false;

new Vue({
  render: (h) =>
    h(App, {
      props: {
        blocks: blocks.all
      }
    })
}).$mount("#app");
