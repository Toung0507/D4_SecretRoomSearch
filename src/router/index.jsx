import { createHashRouter } from "react-router-dom";

// 設定讓每個頁面進入時再載入，而非剛開始就全部載入
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Base from "../page/Base";
import Index from "../page/Index";

const lazyLoad = (importFunc, message) => {
  const Component = lazy(importFunc);
  return (
    <Suspense fallback={<LoadingSpinner message={message} />}>
      <Component />
    </Suspense>
  );
};

const Router = createHashRouter([
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/Register",
        element: lazyLoad(() => import("../page/Register/Register"), "註冊頁面載入中")
      },
      {
        path: "/Login",
        element: lazyLoad(() => import("../page/Login"), "登入頁面載入中"),
      },
      {
        path: "/Game_comment/:state/:id",
        element: lazyLoad(() => import("../page/AddGameComment"), "評論頁面載入中")
      },
      {
        path: "/Game_search",
        element: lazyLoad(() => import("../page/GameSearch"), "搜尋頁面載入中")
      },
      {
        path: "/Game_content/:gameID",
        element: lazyLoad(() => import("../page/GameDetail"), "遊戲介紹載入中")
      },
      {
        path: "/TeamBuy",
        element: lazyLoad(() => import("../page/GroupSearch"), "揪團總覽載入中")
      },
      {
        path: "/About_us",
        element: lazyLoad(() => import("../page/AboutUs"), "關於我們載入中")
      },
      {
        path: "/User_profile/:user_id/:activedefaultTab",
        element: lazyLoad(() => import("../page/UserProfile/UserProfile"), "基本資料載入中")
      },
      {
        path: "/Store_profile/:user_id/:activedefaultTab",
        element: lazyLoad(() => import("../page/StoreProfile/StoreProfile"), "基本資料載入中")
      },
      {
        path: "/TeamBuyComment/:group_id",
        element: lazyLoad(() => import("../page/GroupDetail"), "揪團詳細載入中")
      },
      {
        path: "/AddGames/:game_id?",
        element: lazyLoad(() => import("../page/AddGames"), "新增遊戲表單載入中")
      },
      {
        path: "/Admin",
        element: lazyLoad(() => import("../page/Admin/AdminLayout"), ""),
        children: [
          {
            path: "/Admin/Store",
            element: lazyLoad(() => import("../page/Admin/AdminStore"), "店家列表載入中")
          },
          {
            path: "/Admin/User",
            element: lazyLoad(() => import("../page/Admin/AdminUser"), "會員列表載入中")
          },
          {
            path: "/Admin/Game",
            element: lazyLoad(() => import("../page/Admin/AdminGame"), "遊戲列表載入中")
          },
          {
            path: "/Admin/Group",
            element: lazyLoad(() => import("../page/Admin/AdminGroup"), "揪團列表載入中")
          },
        ],
      }
    ],
  },
  // ⚠️ 加在最後，所有未命中路由都會被導向首頁
  {
    path: "*",
    element: lazyLoad(() => import("../page/NotFound"), "")
  },

]);

export default Router;
