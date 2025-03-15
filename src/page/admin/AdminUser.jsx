import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminUser() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/usersData`);
        setUserData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, []);

  return (
    <div className="admin-bg">
      <div className="adminUser container pt-11 pb-6">
        <nav
          style={{ "--bs-breadcrumb-divider": "'>'" }}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <span className="fs-Body-2 fw-bold text-nature-50">會員管理</span>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <span className="fs-Body-2 fw-bold text-nature-70">會員</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-2">
            <label
              htmlFor="workName"
              className="form-label fs-Caption text-black"
            >
              使用者名稱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="workName"
              placeholder="請輸入內容"
            />
          </div>
          <div className="col-2">
            <label
              htmlFor="contact"
              className="form-label fs-Caption text-black"
            >
              信箱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="contact"
              placeholder="請輸入內容"
            />
          </div>
          <div className="col-2">
            <label
              htmlFor="status"
              className="form-label fs-Caption text-black"
            >
              角色
            </label>
            <select
              className="form-select border-black"
              style={{ color: "#C6C6CA" }}
              id="role"
            >
              <option defaultValue>全部角色</option>
              <option value="member">會員</option>
              <option value="store">店家</option>
              <option value="admin">管理者</option>
            </select>
          </div>
          <div className="col-2">
            <label className="form-label">&nbsp;</label>
            <button className="btn btn-primary-50 text-white disabled form-control">
              搜尋
            </button>
          </div>
        </div>
        <div className="table-container bg-white border rounded-2 border-nature-90 p-6">
          <div className="table-scroll-container overflow-scroll">
            <table className="storeTable w-100">
              <thead>
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">使用者名稱</th>
                  <th className="px-4 py-3">信箱</th>
                  <th className="px-4 py-3">角色</th>
                  <th className="px-4 py-3">登入來源</th>
                  <th className="px-4 py-3">建立時間</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((row) => (
                  <tr key={row.user_id}>
                    <td className="py-2 px-4">{row.user_id}</td>
                    <td className="py-2 px-4">{row.user_name}</td>
                    <td className="py-2 px-4">{row.user_email}</td>
                    <td className="py-2 px-4">{row.user_role}</td>
                    <td className="py-2 px-4">{row.user_reg_method}</td>
                    <td className="py-2 px-4">{row.user_create_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUser;
