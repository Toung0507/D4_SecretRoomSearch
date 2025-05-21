import { Outlet } from "react-router-dom";
import CustomSidebar from "../../layout/SideBar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function AdminLayout() {
  const { user } = useSelector((state) => state.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (user?.user_role !== "管理者") {
      console.log("你不是管理者");
    } else if (user?.user_role === "管理者") {
      setIsAdmin(true);
      console.log("你是管理者");
    }
  }, [user]);

  return (
    <>
      {isAdmin ? (
        <div className="d-flex">
          <CustomSidebar />
          <div className="flex-grow-1">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            <h1>權限錯誤</h1>
            <p>您沒有權限訪問此頁面</p>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLayout;
