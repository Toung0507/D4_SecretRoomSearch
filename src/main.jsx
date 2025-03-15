import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; //React路由
import router from "./router/";
import { Provider } from "react-redux";
import * as bootstrap from "bootstrap"; // 使用 ES module 載入 bootstrap
window.bootstrap = bootstrap; // 手動綁定到 window
import store from "./redux/store.js";
import "./assets/scss/all.scss"; //引入scss

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
