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
        console.log(error.response.data.errors[0]);
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
    <div className="custom-adminBg">
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
          <div className="col-lg-1 d-flex align-items-end">
            <button
              className="btn btn-search btn-primary-50 text-white form-control my-3 my-lg-0"
              onClick={handleSearch}
            >
              搜尋
            </button>
          </div>
          <div className="col-lg-1 d-flex align-items-end">
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
                <div className="card card-admin">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <span
                          className="me-2 px-2 fs-6 rounded-3 bg-secondary-95"
                          style={{ fontSize: "0.8rem" }}
                        >
                          ID: {user.user_id}
                        </span>
                        <p className="fw-bold fs-5">{user.user_name}</p>
                      </div>
                      <button className="edit-btn d-flex align-items-center justify-content-center">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>

                    <div className="status my-4">
                      <div
                        className="d-inline-flex align-items-center bg-nature-90 px-2 rounded-2 border border-nature-60"
                        style={{ height: "26px" }}
                      >
                        <span
                          className="material-symbols-outlined me-2 text-nature-60"
                          style={{ fontSize: "1rem" }}
                        >
                          person
                        </span>
                        <p
                          className="text-nature-50"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {user.user_role}
                        </p>
                      </div>
                    </div>

                    <div className="content row row-cols-1">
                      <div className="user d-flex align-items-center">
                        <span className="material-symbols-outlined me-2 text-nature-50">
                          mail
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            信箱
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {user.user_email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-nature-60">
                      <hr />
                    </div>

                    <div className="date row row-cols-2">
                      <div className="login-source d-flex align-items-center">
                        <span className="material-symbols-outlined me-2 text-nature-50">
                          login
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            登入來源
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {user.user_reg_method}
                          </p>
                        </div>
                      </div>
                      <div className="create-time d-flex align-items-center">
                        <span className="material-symbols-outlined me-2 text-nature-50">
                          calendar_month
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            建立時間
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {user.user_create_at}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col">
              <div className="card">
                <div className="card-body text-center py-2">沒有符合的資料</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUser;
