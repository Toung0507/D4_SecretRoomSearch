import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminStore() {
  const [storeData, setStoreData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "store_create_at",
    direction: "desc",
  });

  const [searchParams, setSearchParams] = useState({
    storeName: "",
    contact: "",
    status: "所有狀態",
  });

  useEffect(() => {
    const getStoreData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/storesData`);
        setStoreData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.log(error.response.data.errors[0]);
      }
    };
    getStoreData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = storeData.filter((store) => {
      const nameMatch =
        searchParams.storeName === "" ||
        store.store_name
          .toLowerCase()
          .includes(searchParams.storeName.toLowerCase());

      const contactMatch =
        searchParams.contact === "" ||
        store.store_contact
          .toLowerCase()
          .includes(searchParams.contact.toLowerCase());

      const statusMatch =
        searchParams.status === "所有狀態" ||
        store.store_isAuth === searchParams.status;

      return nameMatch && contactMatch && statusMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      storeName: "",
      contact: "",
      status: "所有狀態",
    });
    setFilteredData(storeData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "store_create_at") {
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
    <>
      <div className="custom-adminBg">
        <div className="adminUser container pt-11 pb-6">
          <nav
            style={{ "--bs-breadcrumb-divider": "'>'" }}
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <span className="fs-Body-2 fw-bold text-nature-50">
                  會員管理
                </span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <span className="fs-Body-2 fw-bold text-nature-70">店家</span>
              </li>
            </ol>
          </nav>
          <div className="searchBar mt-5 mb-6 row">
            <div className="col-6 col-lg-2">
              <label
                htmlFor="storeName"
                className="form-label fs-Caption text-black"
              >
                工作室名稱
              </label>
              <input
                type="text"
                className="form-control bg-transparent border-black"
                id="storeName"
                placeholder="請輸入內容"
                value={searchParams.storeName}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-6 col-lg-2">
              <label
                htmlFor="contact"
                className="form-label fs-Caption text-black"
              >
                聯絡人
              </label>
              <input
                type="text"
                className="form-control bg-transparent border-black"
                id="contact"
                placeholder="請輸入內容"
                value={searchParams.contact}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-6 col-lg-2">
              <label
                htmlFor="status"
                className="form-label fs-Caption text-black"
              >
                審核狀態
              </label>
              <select
                className="form-select border-black"
                id="status"
                value={searchParams.status}
                onChange={handleSearchChange}
              >
                <option value="所有狀態">所有狀態</option>
                <option value="processing">處理中</option>
                <option value="pass">通過</option>
                <option value="rejected">已退回</option>
              </select>
            </div>
            <div className="col-lg-1 d-flex align-items-end my-3 my-lg-0">
              <button
                className="btn btn-search btn-primary-50 text-white form-control"
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
                      onClick={() => handleSort("store_id")}
                    >
                      ID {getSortIcon("store_id")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_name")}
                    >
                      店家名稱 {getSortIcon("store_name")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_contact")}
                    >
                      聯絡人 {getSortIcon("store_contact")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_self_tel")}
                    >
                      聯絡電話 {getSortIcon("store_self_tel")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_isAuth")}
                    >
                      審核狀態 {getSortIcon("store_isAuth")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_create_at")}
                    >
                      建立時間 {getSortIcon("store_create_at")}
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.store_id}>
                        <td className="py-2 px-4">{row.store_id}</td>
                        <td className="py-2 px-4">{row.store_name}</td>
                        <td className="py-2 px-4">{row.store_contact}</td>
                        <td className="py-2 px-4">{row.store_self_tel}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded-2 text-black ${getStatusBadgeStyle(
                              row.store_isAuth
                            )}`}
                          >
                            {row.store_isAuth === "processing" ? "處理中" : ""}
                            {row.store_isAuth === "pass" ? "通過" : ""}
                            {row.store_isAuth === "rejected" ? "已退回" : ""}
                          </span>
                        </td>
                        <td className="py-2 px-4">{row.store_create_at}</td>
                        <td className="py-2 px-4 text-end">
                          <button className="edit-btn d-flex align-items-center justify-content-center">
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
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
              filteredData.map((store) => (
                <div key={store.store_id} className="col">
                  <div className="card card-admin">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                          <span
                            className="me-2 px-2 fs-6 rounded-3 bg-secondary-95"
                            style={{ fontSize: "0.8rem" }}
                          >
                            ID: {store.store_id}
                          </span>
                          <p className="fw-bold fs-1">{store.store_name}</p>
                        </div>
                        <button className="edit-btn d-flex align-items-center justify-content-center">
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </div>
                      <div className="status my-4">
                        {getStoreStatusCard(store)}
                      </div>
                      <div className="content row row-cols-2">
                        <div className="contact d-flex align-items-center">
                          <span className="material-symbols-outlined me-1 text-nature-50">
                            person
                          </span>
                          <div className="d-flex flex-column">
                            <p
                              className="text-nature-50"
                              style={{ fontSize: "0.8rem" }}
                            >
                              聯絡人
                            </p>
                            <p
                              className="fw-bold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {store.store_contact}
                            </p>
                          </div>
                        </div>
                        <div className="tel d-flex align-items-center">
                          <span className="material-symbols-outlined me-1 text-nature-50">
                            call
                          </span>
                          <div className="d-flex flex-column">
                            <p
                              className="text-nature-50"
                              style={{ fontSize: "0.8rem" }}
                            >
                              聯絡電話
                            </p>
                            <p
                              className="fw-bold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {store.store_self_tel}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-nature-60">
                        <hr />
                      </div>
                      <div className="date d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
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
                            {store.store_create_at}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col">
                <div className="card">
                  <div className="card-body text-center py-2">
                    沒有符合的資料
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "processing":
      return "bg-secondary-95";
    case "pass":
      return "bg-pass";
    case "rejected":
      return "bg-tertiary-90";
  }
};

const getStoreStatusCard = (store) => {
  switch (store.store_isAuth) {
    case "processing":
      return (
        <div
          className="d-inline-flex align-items-center bg-secondary-95 px-2 rounded-2 border border-secondary-80"
          style={{ height: "26px" }}
        >
          <span
            className="material-symbols-outlined me-1 text-secondary-50"
            style={{ fontSize: "0.8rem" }}
          >
            progress_activity
          </span>
          <p className="text-secondary-60" style={{ fontSize: "0.8rem" }}>
            處理中
          </p>
        </div>
      );
    case "pass":
      return (
        <div
          className="d-inline-flex align-items-center bg-pass px-2 rounded-2 border border-success"
          style={{ height: "26px" }}
        >
          <span
            className="material-symbols-outlined me-1 text-success"
            style={{ fontSize: "1rem" }}
          >
            priority
          </span>
          <p className="text-success" style={{ fontSize: "0.8rem" }}>
            通過
          </p>
        </div>
      );
    case "rejected":
      return (
        <div
          className="d-inline-flex align-items-center bg-tertiary-90 px-2 rounded-2 border border-primary-80"
          style={{ height: "26px" }}
        >
          <span
            className="material-symbols-outlined me-1 text-danger"
            style={{ fontSize: "1rem" }}
          >
            close_small
          </span>
          <p className="text-primary-50" style={{ fontSize: "0.8rem" }}>
            已退回
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default AdminStore;
