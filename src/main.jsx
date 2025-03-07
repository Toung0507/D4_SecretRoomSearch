import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; //React路由
import router from "./router/";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/scss/all.scss"; //引入scss

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
