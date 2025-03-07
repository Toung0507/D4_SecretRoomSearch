import { createBrowserRouter } from "react-router-dom";
import Base from "../page/Base";
import Game_comment from "../page/Game_comment";
import Game_search from "../page/Game_search";
import About_us from "../page/About_us";
import Index from "../page/Index";

// 利用 createBrowserRouter 定義路由配置
const Router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Base />,
            children: [
                {
                    path: "/",
                    element: <Index />
                },
                {
                    path: "/Game_comment",
                    element: <Game_comment />,
                },
                {
                    path: "/Game_search",
                    element: <Game_search />,
                },
                {
                    path: "/About_us",
                    element: <About_us />,
                }
            ]
        },
    ]
);

export default Router;
