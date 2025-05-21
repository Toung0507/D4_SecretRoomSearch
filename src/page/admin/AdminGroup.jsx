import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminGroup() {
  const [groupData, setGroupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState({});
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "group_active_date",
    direction: "desc",
  });

  const [searchParams, setSearchParams] = useState({
    roomName: "",
    leader: "",
    status: "全部狀態",
  });

  useEffect(() => {
    const getGroupData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/groupsData`);
        setGroupData(res.data);
        setFilteredData(res.data);

        // 提取所有不重複的 user_id
        const userIds = [...new Set(res.data.map((item) => item.user_id))];
        console.log(userIds);

        try {
          // 平行發出所有請求
          const userPromises = userIds.map((id) =>
            axios.get(`${BASE_URL}/usersData/${id}`)
          );
          const userResponses = await Promise.all(userPromises);

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

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = groupData.filter((group) => {
      // 檢查密室名稱
      const nameMatch =
        searchParams.roomName === "" ||
        group.game_name
          .toLowerCase()
          .includes(searchParams.roomName.toLowerCase());

      // 檢查主糾人，需要通過 userData 來比較
      let leaderMatch = searchParams.leader === "";
      if (!leaderMatch && userData[group.user_id]) {
        leaderMatch = userData[group.user_id].user_name
          .toLowerCase()
          .includes(searchParams.leader.toLowerCase());
      }

      // 檢查狀態
      const statusValue = getGroupStatus(group); // 使用原有的函數獲取狀態文字
      const statusMatch =
        searchParams.status === "全部狀態" ||
        statusValue === searchParams.status;

      return nameMatch && leaderMatch && statusMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      roomName: "",
      leader: "",
      status: "全部狀態",
    });
    setFilteredData(groupData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "group_end_at" || key === "group_active_date") {
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
              <span className="fs-Body-2 fw-bold text-nature-50">揪團資料</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-6 col-lg-2">
            <label
              htmlFor="roomName"
              className="form-label fs-Caption text-black"
            >
              密室名稱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="roomName"
              placeholder="請輸入內容"
              value={searchParams.roomName}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label
              htmlFor="leader"
              className="form-label fs-Caption text-black"
            >
              主糾人
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="leader"
              placeholder="請輸入內容"
              value={searchParams.leader}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label
              htmlFor="status"
              className="form-label fs-Caption text-black"
            >
              狀態
            </label>
            <select
              className="form-select border-black"
              style={{
                color:
                  searchParams.status === "全部狀態" ? "#C6C6CA" : "inherit",
              }}
              id="status"
              value={searchParams.status}
              onChange={handleSearchChange}
            >
              <option value="全部狀態">全部狀態</option>
              <option value="揪團中">揪團中</option>
              <option value="揪團成功">揪團成功</option>
              <option value="已取消">已取消</option>
              <option value="已結束">已結束</option>
            </select>
          </div>
          <div className="col-lg-1 col-12 d-flex align-items-end">
            <button
              className="btn btn-search btn-primary-50 text-white form-control my-3"
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
                    onClick={() => handleSort("group_id")}
                  >
                    ID {getSortIcon("group_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("game_name")}
                  >
                    密室名稱 {getSortIcon("game_name")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_id")}
                  >
                    主糾人 {getSortIcon("user_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("group_member")}
                  >
                    總人數 {getSortIcon("group_member")}
                  </th>
                  <th className="px-4 py-3">
                    狀態 {getSortIcon("group_isSuccessful")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("group_end_at")}
                  >
                    揪團截止日期 {getSortIcon("group_end_at")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("group_active_date")}
                  >
                    活動日期 {getSortIcon("group_active_date")}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.group_id}>
                    <td className="py-2 px-4">{row.group_id}</td>
                    <td className="py-2 px-4">{row.game_name}</td>
                    <td className="py-2 px-4">
                      {userData[row.user_id]?.user_name || "未知用戶"}
                    </td>
                    <td className="py-2 px-4">{row.group_member}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-2 text-black ${getGroupStatusStyle(
                          row
                        )}`}
                      >
                        {getGroupStatus(row)}
                      </span>
                    </td>
                    <td className="py-2 px-4">{row.group_end_at}</td>
                    <td className="py-2 px-4">{row.group_active_date}</td>
                    <td className="py-2 px-4 text-end">
                      <button className="edit-btn d-flex align-items-center justify-content-center">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="cards-container d-lg-none row row-cols-1 row-cols-md-2 g-3">
          {filteredData.length > 0 ? (
            filteredData.map((group) => (
              <div key={group.group_id} className="col">
                <div className="card card-admin h-100">
                  <div className="card-body row">
                    <p className="id col-4">ID</p>
                    <p className="game_name col-8">密室名稱</p>
                    <p className="id col-4">{group.group_id}</p>
                    <p className="game_name col-8">{group.game_name}</p>
                    <p className="leader col-4 mt-4">主糾人</p>
                    <p className="member col-8 mt-4">總人數</p>
                    <p className="leader col-4 mb-4">
                      {userData[group.user_id]?.user_name || "未知用戶"}
                    </p>
                    <p className="member col-8 mb-4">{group.group_member}</p>
                    <p className="status col-4">狀態</p>
                    <p className="end_date col-8">揪團截止日期</p>
                    <div className="status col-4">
                      <span
                        className={`px-2 py-1 rounded-2 text-black ${getGroupStatusStyle(
                          group
                        )}`}
                        style={{ fontSize: "12px" }}
                      >
                        {getGroupStatus(group)}
                      </span>
                    </div>
                    <p className="end_date col-8">{group.group_end_at}</p>
                    <p className="active_date col-4 mt-4">活動日期</p>
                    <p className="col-8 mt-4"></p>
                    <p className="active_date col-4 mb-4">
                      {group.group_active_date}
                    </p>
                    <p className="col-8 mb-4"></p>
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
                      <button className="edit-btn d-flex align-items-center justify-content-center">
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

const getGroupStatusStyle = (row) => {
  if (row.group_isEnd) return "bg-nature-90";

  if (row.group_cancel) return "bg-tertiary-90";

  if (row.group_isSuccessful) {
    return "bg-pass";
  } else {
    return "bg-secondary-90";
  }
};

const getGroupStatus = (row) => {
  if (row.group_isEnd) return "已結束";

  if (row.group_cancel) return "已取消";

  if (row.group_isSuccessful) {
    return "揪團成功";
  } else {
    return "揪團中";
  }
};

export default AdminGroup;
