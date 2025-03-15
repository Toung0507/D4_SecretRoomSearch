import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminGroup() {
  const [groupData, setGroupData] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getGroupData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/groupsData`);
        setGroupData(res.data);

        // 提取所有不重複的 user_id
        const userIds = [...new Set(res.data.map((item) => item.user_id))];
        console.log(userIds);

        try {
          // 平行發出所有請求
          const userPromises = userIds.map((id) =>
            axios.get(`${BASE_URL}/usersData/${id}`)
          );
          const userResponses = await Promise.all(userPromises);
          console.log(userResponses);

          // 建立 id 到用戶資料的映射
          const userMap = {};
          userResponses.forEach((response) => {
            const userData = response.data;
            userMap[userData.id] = userData;
          });

          setUserData(userMap);
        } catch (error) {
          console.error("獲取用戶資料時出錯:", error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getGroupData();
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
              <span className="fs-Body-2 fw-bold text-nature-50">揪團資料</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-2">
            <label
              htmlFor="workName"
              className="form-label fs-Caption text-black"
            >
              密室名稱
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
              主糾人
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
              狀態
            </label>
            <select
              className="form-select border-black"
              style={{ color: "#C6C6CA" }}
              id="role"
            >
              <option defaultValue>全部狀態</option>
              <option value="member">揪團中</option>
              <option value="store">揪團成功</option>
              <option value="admin">已取消</option>
              <option value="admin">已結束</option>
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
                  <th className="px-4 py-3">密室名稱</th>
                  <th className="px-4 py-3">主糾人</th>
                  <th className="px-4 py-3">總人數</th>
                  <th className="px-4 py-3">狀態</th>
                  <th className="px-4 py-3">揪團截止日期</th>
                  <th className="px-4 py-3">活動日期</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {groupData.map((row) => (
                  <tr key={row.group_id}>
                    <td className="py-2 px-4">{row.group_id}</td>
                    <td className="py-2 px-4">{row.game_name}</td>
                    <td className="py-2 px-4">
                      {userData[row.user_id]?.user_name || "未知用戶"}
                    </td>
                    <td className="py-2 px-4">{row.group_member}</td>
                    <td className="py-2 px-4">{row.user_reg_method}</td>
                    <td className="py-2 px-4">{row.group_end_at}</td>
                    <td className="py-2 px-4">{row.group_active_date}</td>
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

export default AdminGroup;
