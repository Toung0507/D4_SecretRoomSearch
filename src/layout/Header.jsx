import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { logOut } from "../redux/slices/userInfoSlice";

const navbar = [
  { path: "Game_search", name: "找遊戲" },
  { path: "TeamBuy", name: "揪團去" },
];

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, user_token } = useSelector((state) => state.userInfo);
  const [finalBtn, setFinalBtn] = useState(null);
  const user_id = Number(user?.user_id);

  //這是管理者的頁面
  const adminBtn = useMemo(() => [
    { path: "/Admin/User", name: "會員管理" },
    { path: "/Admin/Store", name: "店家管理" },
    { path: "/Admin/Game", name: "密室管理" },
    { path: "/Admin/Group", name: "揪團資料" },
  ], []);

  //這是一般會員的下拉式選單
  const userBtn = useMemo(() => [
    { path: `/User_profile/${user_id}/basicInfo`, name: "個人資料" },
    { path: `/User_profile/${user_id}/participatingGroup`, name: "我的揪團" },
    { path: `/User_profile/${user_id}/myComments`, name: "我的評論" },
  ], [user_id]); // 依賴 user_id，當 user_id 改變時才重新計算

  //這是店家會員的下拉式選單
  const storeBtn = useMemo(() => [
    { path: `/Store_profile/${user_id}/basicStoreInfo`, name: "個人資料" },
    { path: `/Store_profile/${user_id}/myGames`, name: "我的密室" },
  ], [user_id]);

  useEffect(() => {
    if (user_token) {
      const role = user.user_role;
      setFinalBtn(null);
      if (role === "會員") {
        setFinalBtn(userBtn);
      } else if (role === "店家") {
        setFinalBtn(storeBtn);
      } else if (role === "管理者") {
        setFinalBtn(adminBtn);
      } else {
        setFinalBtn(null);
      }
    }
  }, [user_token, user, adminBtn, storeBtn, userBtn]);

  const handleLogOut = () => {
    handleNavCollapse();
    dispatch(logOut());
    navigate("/");
  };
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(true);
  return (
    <>
      {user_token ? (
        <nav className="navbar navbar-expand-lg w-100 bg-primary-99 position-fixed top-0 start-0 d-lg-flex justify-content-between">
          <div className="nav-box container d-lg-none d-flex flex-row justify-content-between align-items-center">
            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand m-0 d-inline" to="/" onClick={handleNavCollapse}>
              <img src="./logo/Logo-Type-sm.svg" alt="logo" />
            </Link>
          </div>
          <div className="container px-0 px-lg-3">
            <div
              className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse d-lg-flex justify-content-between`}
              id="navbarSupportedContent"
            >
              <Link className="m-0 d-none d-lg-inline" to="/" onClick={handleNavCollapse}>
                <img src="./logo/Logo-Type.svg" alt="logo-lg" />
              </Link>
              <ul className="navbar-nav text-center gap-lg-10 bg-primary-99 align-items-center">
                {navbar.map((routes) => (
                  <li className="nav-item" key={routes.path}>
                    <NavLink
                      className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                      aria-current="page"
                      to={routes.path}
                      onClick={handleNavCollapse}
                    >
                      {routes.name}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item bg-Secondary-99 dropdown">
                  <NavLink
                    className="dropdown-toggle nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                    id="dropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user?.user_name}
                  </NavLink>
                  <ul
                    className="dropdown-menu dropdown-menu-end bg-primary-99 text-center align-items-center"
                    aria-labelledby="dropdownMenuLink"
                  >
                    {finalBtn &&
                      finalBtn.map((routes) => (
                        <li key={routes.path}>
                          <NavLink
                            className="dropdown-item nav-link px-0 py-4 fs-h6 fw-bold"
                            aria-current="page"
                            to={routes.path}
                            onClick={handleNavCollapse}
                          >
                            {routes.name}
                          </NavLink>
                        </li>
                      ))}
                    <button
                      className="dropdown-item nav-link px-0 py-4 fs-h6 fw-bold"
                      onClick={handleLogOut}
                    >
                      登出
                    </button>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navbar navbar-expand-lg w-100 bg-primary-99 position-fixed top-0 start-0 d-lg-flex justify-content-between">
          <div className="nav-box container d-lg-none d-flex flex-row justify-content-between align-items-center">
            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand m-0 d-inline" to="/" onClick={handleNavCollapse}>
              <img src="./logo/Logo-Type-sm.svg" alt="logo" />
            </Link>
          </div>
          <div className="container px-0 px-lg-3">
            <div
              className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse d-lg-flex justify-content-between`}
              id="navbarSupportedContent"
            >
              <Link className="m-0 d-none d-lg-inline" to="/" onClick={handleNavCollapse}>
                <img src="./logo/Logo-Type.svg" alt="logo-lg" />
              </Link>
              <ul className="navbar-nav text-center gap-lg-10 bg-primary-99 align-items-center">
                {navbar.map((routes) => (
                  <li className="nav-item" key={routes.path}>
                    <NavLink
                      className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                      aria-current="page"
                      to={routes.path}
                      onClick={handleNavCollapse}
                    >
                      {routes.name}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item">
                  <Link
                    className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                    to="/Login"
                    onClick={handleNavCollapse}
                  >
                    登入
                  </Link>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
export default Header;
