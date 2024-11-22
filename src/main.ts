import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  name as appName,
  version as appVersion,
  author,
} from "../package.json";

console.group(
  `Starting up NNM Pace calculator ${appVersion} proudly presented by ${author.name}`,
);

const app = createApp(App);

console.info("App created");

app.use(router);

console.info("Router added");

app.config.errorHandler = (error) => {
  console.error("Error occurred", error);
};

app.mount("#app");

console.info("App fully mounted and everything good to go");

console.groupEnd();
