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
          console.log(error.response.data.errors[0]);
        }
      } catch (error) {
        console.log(error.response.data.errors[0]);
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
      // 處理特殊狀態排序
      if (key === "group_isSuccessful") {
        // 將狀態轉換為可排序的數值 (已結束:3 > 已取消:2 > 揪團成功:1 > 揪團中:0)
        const getStatusValue = (row) => {
          if (row.group_isEnd) return 3;
          if (row.group_cancel) return 2;
          if (row.group_isSuccessful) return 1;
          return 0;
        };

        const valueA = getStatusValue(a);
        const valueB = getStatusValue(b);

        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      // 處理數值型欄位
      if (key === "group_id" || key === "group_member") {
        const numA = parseInt(a[key], 10);
        const numB = parseInt(b[key], 10);

        return direction === "asc" ? numA - numB : numB - numA;
      }

      // 處理日期欄位
      if (key === "group_end_at" || key === "group_active_date") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);

        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // 處理用戶ID (可能需要用到userData顯示名稱)
      if (key === "user_id") {
        const nameA = userData[a[key]]?.user_name || "";
        const nameB = userData[b[key]]?.user_name || "";

        if (direction === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      }

      // 一般字符串比較
      if (direction === "asc") {
        return String(a[key]).localeCompare(String(b[key]));
      } else {
        return String(b[key]).localeCompare(String(a[key]));
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
              主揪人
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
              id="status"
              value={searchParams.status}
              onChange={handleSearchChange}
            >
              <option value="全部狀態">全部狀態</option>
              <option value="揪團中">揪團中</option>
              <option value="已棄團">已棄團</option>
              <option value="已結束">已結束</option>
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
                    主揪人 {getSortIcon("user_id")}
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
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
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
                  ))) : (
                  <tr>
                    <td className="text-center py-2" colSpan={7}>沒有符合的資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="cards-container d-lg-none row row-cols-1 row-cols-md-2 g-3">
          {filteredData.length > 0 ? (
            filteredData.map((group) => (
              <div key={group.group_id} className="col">
                <div className="card card-admin">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <span
                          className="me-2 px-2 fs-6 rounded-3 bg-secondary-95"
                          style={{ fontSize: "0.8rem" }}
                        >
                          ID: {group.group_id}
                        </span>
                        <p className="fw-bold fs-1">{group.game_name}</p>
                      </div>
                      <button className="edit-btn d-flex align-items-center justify-content-center">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                    <div className="status my-4">
                      {getGroupStautsCard(group)}
                    </div>
                    <div className="content row row-cols-2">
                      <div className="user d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          person
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            主揪人
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {userData[group.user_id]?.user_name || "未知用戶"}
                          </p>
                        </div>
                      </div>
                      <div className="user d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          groups
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            總人數
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {group.group_member}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-nature-60">
                      <hr />
                    </div>
                    <div className="date row row-cols-2">
                      <div className="end_date d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          calendar_month
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            揪團截止日期
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {group.group_end_at}
                          </p>
                        </div>
                      </div>
                      <div className="active_date d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          calendar_month
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            活動日期
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {group.group_active_date}
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
  if (row.group_isSuccessful) return "bg-nature-90";

  if (row.group_cancel) {
    return "bg-tertiary-90";
  } else {
    return "bg-secondary-90";
  }
};

const getGroupStatus = (row) => {
  if (row.group_isSuccessful) return "已結束";

  if (row.group_cancel) {
    return "已棄團";
  } else {
    return "揪團中";
  }
};

const getGroupStautsCard = (row) => {
  if (row.group_isSuccessful) {
    return (
      <div
        className="d-inline-flex align-items-center bg-nature-90 px-2 rounded-2 border border-nature-60"
        style={{ height: "26px" }}
      >
        <span
          className="material-symbols-outlined me-1 text-nature-60"
          style={{ fontSize: "1rem" }}
        >
          event_busy
        </span>
        <p className="text-nature-50" style={{ fontSize: "0.8rem" }}>
          已結束
        </p>
      </div>
    );
  }

  if (row.group_cancel) {
    return (
      <div className="d-inline-flex align-items-center bg-primary-95 px-2 rounded-2 border border-primary-80">
        <span className="material-symbols-outlined me-1 text-danger">
          close_small
        </span>
        <p className="text-primary-50" style={{ fontSize: "0.8rem" }}>
          已棄團
        </p>
      </div>
    );
  } else {
    return (
      <div
        className="d-inline-flex align-items-center bg-secondary-90 px-2 rounded-2 border border-secondary-80"
        style={{ height: "26px" }}
      >
        <span
          className="material-symbols-outlined me-1 text-secondary-50"
          style={{ fontSize: "0.8rem" }}
        >
          progress_activity
        </span>
        <p className="text-secondary-60" style={{ fontSize: "0.8rem" }}>
          揪團中
        </p>
      </div>
    );
  }
};

export default AdminGroup;
