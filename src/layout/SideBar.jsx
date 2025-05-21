import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

const MenuBookIcon = () => (
  <span className="material-symbols-outlined">menu_book</span>
);

const AccountCircle = () => (
  <span className="material-symbols-outlined">account_circle</span>
);

const StoreFront = () => (
  <span className="material-symbols-outlined">storefront</span>
);

const SportsEsports = () => (
  <span className="material-symbols-outlined">sports_esports</span>
);

const Groups = () => <span className="material-symbols-outlined">groups</span>;

const CustomSidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // 取得當前路徑

  // 檢查路徑是否匹配特定模式
  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItemStyles = {
    root: {
      fontSize: "16px",
      color: "white",
      fontWeight: 700,
    },
    icon: {
      color: "white",
      fontSize: "20px",
    },
    SubMenuExpandIcon: {
      color: "white",
    },
    subMenuContent: {
      backgroundColor: "#006684",
    },
  };

  return (
    <div className="sidebar d-none d-lg-block">
      <Sidebar
        collapsed={collapsed}
        width="250px"
        backgroundColor="#006684"
        collapsedWidth="80px"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <Menu menuItemStyles={menuItemStyles}>
          <SubMenu icon={<MenuBookIcon />} label="會員管理">
            <MenuItem
              icon={<AccountCircle />}
              active={isActive("/Admin/User")}
              onClick={() => navigate("/Admin/User")}
            >
              會員
            </MenuItem>
            <MenuItem
              icon={<StoreFront />}
              active={isActive("/Admin")}
              onClick={() => navigate("/Admin")}
            >
              店家
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<SportsEsports />}
            active={isActive("/Admin/Game")}
            onClick={() => navigate("/Admin/Game")}
          >
            密室資料
          </MenuItem>
          <MenuItem
            icon={<Groups />}
            active={isActive("/Admin/Group")}
            onClick={() => navigate("/Admin/Group")}
          >
            揪團資料
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default CustomSidebar;
