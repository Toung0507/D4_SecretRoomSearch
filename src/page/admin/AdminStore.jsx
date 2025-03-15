import { useEffect, useState } from "react";
// import VirtualizedTable from "../../layout/VirtualizedTable";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminStore() {
  const [storeData, setStoreData] = useState([]);

  // TODO 這裡是原本的 table 套件程式碼，因為要改成自己寫的 table，所以先註解掉
  // table 套件程式碼
  // const [tableData, setTableData] = useState([]);
  // const labels = [
  //   {
  //     width: 50,
  //     label: "ID",
  //     dataKey: "ID",
  //   },
  //   {
  //     width: 250,
  //     label: "店家名稱",
  //     dataKey: "storeName",
  //   },
  //   {
  //     width: 100,
  //     label: "聯絡人",
  //     dataKey: "contact",
  //   },
  //   {
  //     width: 200,
  //     label: "聯絡電話",
  //     dataKey: "phone",
  //     // numeric: true,
  //   },
  //   {
  //     width: 200,
  //     label: "審核狀態",
  //     dataKey: "status",
  //   },
  //   {
  //     width: 200,
  //     label: "建立時間",
  //     dataKey: "createdAt",
  //   },
  //   {
  //     width: 50,
  //     label: "",
  //     dataKey: "action",
  //   },
  // ];
  // useEffect(() => {
  //   const newTableData = storeData.map((item, index) => ({
  //     ID: index + 1,
  //     storeName: item.store_name,
  //     contact: item.store_contact,
  //     phone: item.store_self_tel,
  //     status: item.store_isAuth,
  //     createdAt: item.store_create_at,
  //   }));
  //   setTableData(newTableData);
  // }, [storeData]);

  useEffect(() => {
    const getStoreData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/storesData`);
        setStoreData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getStoreData();
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
              <span className="fs-Body-2 fw-bold text-nature-70">店家</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-2">
            <label
              htmlFor="workName"
              className="form-label fs-Caption text-black"
            >
              工作室名稱
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
              聯絡人
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
              審核狀態
            </label>
            <select
              className="form-select border-black"
              style={{ color: "#C6C6CA" }}
              id="status"
            >
              <option defaultValue>所有狀態</option>
              <option value="processing">處理中</option>
              <option value="pass">通過</option>
              <option value="rejected">已退回</option>
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
                  <th className="px-4 py-3">店家名稱</th>
                  <th className="px-4 py-3">聯絡人</th>
                  <th className="px-4 py-3">聯絡電話</th>
                  <th className="px-4 py-3">審核狀態</th>
                  <th className="px-4 py-3">建立時間</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {storeData.map((row) => (
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
                      <button className="edit-btn">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
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

export default AdminStore;

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "processing":
      return "bg-secondary-95";
    case "pass":
      return "bg-green-100";
    case "rejected":
      return "bg-pink-100";
    default:
      return "bg-gray-100";
  }
};
