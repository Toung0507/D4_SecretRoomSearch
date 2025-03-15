import { Outlet } from "react-router-dom";
import CustomSidebar from "../../layout/SideBar";

function AdminLayout() {
  return (
    <>
      <CustomSidebar />
      <Outlet />
    </>
  );
}

export default AdminLayout;
