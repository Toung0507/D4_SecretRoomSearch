import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminUser() {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "user_create_at",
    direction: "desc",
  });

  const [searchParams, setSearchParams] = useState({
    userName: "",
    email: "",
    role: "all",
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/usersData`);
        setUserData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = userData.filter((user) => {
      const nameMatch =
        searchParams.userName === "" ||
        user.user_name
          .toLowerCase()
          .includes(searchParams.userName.toLowerCase());

      const emailMatch =
        searchParams.email === "" ||
        user.user_email
          .toLowerCase()
          .includes(searchParams.email.toLowerCase());

      const roleMatch =
        searchParams.role === "全部角色" ||
        user.user_role === searchParams.role;

      return nameMatch && emailMatch && roleMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      userName: "",
      email: "",
      role: "全部角色",
    });
    setFilteredData(userData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "user_create_at") {
        // 將日期字符串轉換為日期對象進行比較
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);

        if (direction === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else {
        // 一般字符串比較
        if (direction === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      }
    });

    setFilteredData(sortedData);
  };

  // 獲取排序圖標
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <div></div>;
    }

    return sortConfig.direction === "asc" ? (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "18px", position: "absolute", padding: "3px 0" }}
      >
        arrow_upward
      </span>
    ) : (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "18px", position: "absolute", padding: "3px 0" }}
      >
        arrow_downward
      </span>
    );
  };

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
          <div className="col-6 col-lg-2">
            <label
              htmlFor="userName"
              className="form-label fs-Caption text-black"
            >
              使用者名稱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="userName"
              placeholder="請輸入內容"
              value={searchParams.userName}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="email" className="form-label fs-Caption text-black">
              信箱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="email"
              placeholder="請輸入內容"
              value={searchParams.email}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="role" className="form-label fs-Caption text-black">
              角色
            </label>
            <select
              className="form-select border-black"
              style={{
                color: searchParams.role === "全部角色" ? "#C6C6CA" : "inherit",
              }}
              id="role"
              value={searchParams.role}
              onChange={handleSearchChange}
            >
              <option value="全部角色">全部角色</option>
              <option value="會員">會員</option>
              <option value="店家">店家</option>
              <option value="管理者">管理者</option>
            </select>
          </div>
          <div className="col-lg-1 col-12 d-flex align-items-end">
            <button
              className="btn btn-search btn-primary-50 text-white form-control my-3 my-lg-0"
              onClick={handleSearch}
            >
              搜尋
            </button>
          </div>
          <div className="col-lg-1 col-12 d-flex align-items-end">
            <button
              className="btn btn-reset btn-outline-secondary form-control"
              onClick={handleReset}
            >
              重置
            </button>
          </div>
        </div>
        <div className="table-container d-none d-lg-block bg-white border rounded-2 border-nature-90 p-6">
          <div className="table-scroll-container overflow-scroll">
            <table className="storeTable w-100">
              <thead>
                <tr>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_id")}
                  >
                    ID {getSortIcon("user_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_name")}
                  >
                    使用者名稱 {getSortIcon("user_name")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_email")}
                  >
                    信箱 {getSortIcon("user_email")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_role")}
                  >
                    角色 {getSortIcon("user_role")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_reg_method")}
                  >
                    登入來源 {getSortIcon("user_reg_method")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_create_at")}
                  >
                    建立時間 {getSortIcon("user_create_at")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row.user_id}>
                      <td className="py-2 px-4">{row.user_id}</td>
                      <td className="py-2 px-4">{row.user_name}</td>
                      <td className="py-2 px-4">{row.user_email}</td>
                      <td className="py-2 px-4">{row.user_role}</td>
                      <td className="py-2 px-4">{row.user_reg_method}</td>
                      <td className="py-2 px-4">{row.user_create_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      沒有符合的資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="cards-container d-lg-none row row-cols-1 row-cols-md-2 g-3">
          {filteredData.length > 0 ? (
            filteredData.map((user) => (
              <div key={user.user_id} className="col">
                <div className="card card-admin h-100">
                  <div className="card-body row">
                    <p className="id col-4">ID</p>
                    <p className="user_name col-8">使用者名稱</p>
                    <p className="id col-4">{user.user_id}</p>
                    <p className="user_name col-8">{user.user_name}</p>
                    <p className="email col-12 mt-4">信箱</p>
                    <p className="email col-12 mb-4">{user.user_email}</p>
                    <p className="role col-4">角色</p>
                    <p className="login_source col-8">登入來源</p>
                    <p className="role col-4 mb-4">{user.user_role}</p>
                    <p className="login_source col-8">{user.user_reg_method}</p>
                    <p className="create_time col-8">建立時間</p>
                    <p className="create_time col-8">{user.user_create_at}</p>
                    <div className="col-12 text-nature-95">
                      <hr
                        style={{
                          marginBottom: 0,
                          height: "2px",
                          borderWidth: "2px",
                        }}
                      />
                    </div>
                    <div className="col-12 d-flex justify-content-end mt-2">
                      <button
                        className="edit-btn d-flex align-items-center justify-content-center"
                        onClick={() => handleShowModal(store)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-4">沒有符合的資料</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUser;
