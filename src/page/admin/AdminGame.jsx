import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminGame() {
  const [gameData, setGameData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "game_id",
    direction: "asc",
  });

  const [searchParams, setSearchParams] = useState({
    gameName: "",
    tag: "",
    is_stock: "全部狀態",
  });

  useEffect(() => {
    const getGameData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gamesData`);
        setGameData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.log(error.response.data.errors[0]);
      }
    };
    getGameData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = gameData.filter((game) => {
      // 檢查密室名稱
      const nameMatch =
        searchParams.gameName === "" ||
        game.game_name
          .toLowerCase()
          .includes(searchParams.gameName.toLowerCase());

      // 檢查標籤 - 這裡可能需要根據實際的標籤結構調整
      const tagMatch =
        searchParams.tag === "" ||
        game.game_dif_tagname
          .toLowerCase()
          .includes(searchParams.tag.toLowerCase()) ||
        game.game_main_tag1name
          .toLowerCase()
          .includes(searchParams.tag.toLowerCase()) ||
        game.game_main_tag2name
          .toLowerCase()
          .includes(searchParams.tag.toLowerCase());

      // 檢查狀態
      const statusMatch =
        searchParams.is_stock === "全部狀態" ||
        (searchParams.is_stock === "true" && game.game_isStock === true) ||
        (searchParams.is_stock === "false" && game.game_isStock === false);

      return nameMatch && tagMatch && statusMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      gameName: "",
      tag: "",
      is_stock: "全部狀態", // 修正：重置為 "全部狀態"
    });
    setFilteredData(gameData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      // 處理數值型欄位
      if (
        key === "game_id" ||
        key === "game_score" ||
        key === "game_score_num"
      ) {
        const numA = parseFloat(a[key] || 0);
        const numB = parseFloat(b[key] || 0);

        return direction === "asc" ? numA - numB : numB - numA;
      }

      // 處理上/下架狀態
      if (key === "game_isStock") {
        // true (上架) 排在 false (下架) 前面或後面
        const boolA = Boolean(a[key]);
        const boolB = Boolean(b[key]);

        if (direction === "asc") {
          return boolA === boolB ? 0 : boolA ? 1 : -1;
        } else {
          return boolA === boolB ? 0 : boolA ? -1 : 1;
        }
      }

      // 標籤排序 - 針對特定標籤欄位進行排序
      if (
        key === "game_dif_tagname" ||
        key === "game_main_tag1name" ||
        key === "game_main_tag2name"
      ) {
        if (direction === "asc") {
          return String(a[key] || "").localeCompare(String(b[key] || ""));
        } else {
          return String(b[key] || "").localeCompare(String(a[key] || ""));
        }
      }

      // 一般字符串比較
      if (direction === "asc") {
        return String(a[key] || "").localeCompare(String(b[key] || ""));
      } else {
        return String(b[key] || "").localeCompare(String(a[key] || ""));
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
              <span className="fs-Body-2 fw-bold text-nature-50">密室管理</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-6 col-lg-2">
            <label
              htmlFor="gameName"
              className="form-label fs-Caption text-black"
            >
              密室名稱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="gameName"
              placeholder="請輸入內容"
              value={searchParams.gameName}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="tag" className="form-label fs-Caption text-black">
              標籤
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="tag"
              placeholder="請輸入內容"
              value={searchParams.tag}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label
              htmlFor="is_stock"
              className="form-label fs-Caption text-black"
            >
              狀態
            </label>
            <select
              className="form-select border-black"
              id="is_stock"
              value={searchParams.is_stock}
              onChange={handleSearchChange}
            >
              <option value="全部狀態">全部狀態</option>
              <option value="true">上架</option>
              <option value="false">下架</option>
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
                    onClick={() => handleSort("game_id")}
                  >
                    ID {getSortIcon("game_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("game_name")}
                  >
                    密室名稱 {getSortIcon("game_name")}
                  </th>
                  <th
                    className="px-4 py-3 text-center"
                    onClick={() => handleSort("game_score")}
                  >
                    評分 {getSortIcon("game_score")}
                  </th>
                  <th
                    className="px-4 py-3 text-center"
                    onClick={() => handleSort("game_score_num")}
                  >
                    評論人數 {getSortIcon("game_score_num")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("game_dif_tagname")}
                  >
                    標籤 {getSortIcon("game_dif_tagname")}
                  </th>
                  <th
                    className="px-4 py-3 text-center"
                    onClick={() => handleSort("game_isStock")}
                  >
                    狀態 {getSortIcon("game_isStock")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row.game_id}>
                      <td className="py-2 px-4">{row.game_id}</td>
                      <td className="py-2 px-4">{row.game_name}</td>
                      <td className="py-2 px-4 text-center">{row.game_score}</td>
                      <td className="py-2 px-4 text-center">
                        {row.game_score_num}
                      </td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded-2 text-black bg-nature-95">
                          {row.game_dif_tagname}
                        </span>
                        <span className="px-2 py-1 mx-2 rounded-2 text-black bg-nature-95">
                          {row.game_main_tag1name}
                        </span>
                        <span className="px-2 py-1 rounded-2 text-black bg-nature-95">
                          {row.game_main_tag2name}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">
                        {row.game_isStock == true ? (
                          <span className="px-2 py-1 rounded-2 text-black bg-pass">
                            上架
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-2 text-black bg-tertiary-90">
                            下架
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-2" colSpan={6}>沒有符合的資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="cards-container d-lg-none row row-cols-1 row-cols-md-2 g-3">
          {filteredData.length > 0 ? (
            filteredData.map((game) => (
              <div key={game.game_id} className="col">
                <div className="card card-admin h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <span
                          className="me-2 px-2 fs-6 rounded-3 bg-secondary-95"
                          style={{ fontSize: "0.8rem" }}
                        >
                          ID: {game.game_id}
                        </span>
                        <p className="fw-bold fs-1">{game.game_name}</p>
                      </div>
                      <button className="edit-btn d-flex align-items-center justify-content-center">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                    <div className="status my-4">
                      {game.game_isStock ? (
                        <div
                          className="d-inline-flex align-items-center bg-pass px-2 rounded-2 border border-success"
                          style={{ height: "26px" }}
                        >
                          <span
                            className="material-symbols-outlined me-1 text-success"
                            style={{ fontSize: "1rem" }}
                          >
                            check_circle
                          </span>
                          <p
                            className="text-success"
                            style={{ fontSize: "0.8rem" }}
                          >
                            上架
                          </p>
                        </div>
                      ) : (
                        <div
                          className="d-inline-flex align-items-center bg-tertiary-90 px-2 rounded-2 border border-tertiary-80"
                          style={{ height: "26px" }}
                        >
                          <span
                            className="material-symbols-outlined me-1 text-tertiary-50"
                            style={{ fontSize: "1rem" }}
                          >
                            cancel
                          </span>
                          <p
                            className="text-tertiary-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            下架
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="content row row-cols-2">
                      <div className="score d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          star
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            評分
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {game.game_score}
                          </p>
                        </div>
                      </div>
                      <div className="review-count d-flex align-items-center">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          forum
                        </span>
                        <div className="d-flex flex-column">
                          <p
                            className="text-nature-50"
                            style={{ fontSize: "0.8rem" }}
                          >
                            評論人數
                          </p>
                          <p className="fw-bold" style={{ fontSize: "0.8rem" }}>
                            {game.game_score_num}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-nature-60">
                      <hr />
                    </div>
                    <div className="tags">
                      <div className="d-flex align-items-center mb-2">
                        <span className="material-symbols-outlined me-1 text-nature-50">
                          sell
                        </span>
                        <p
                          className="text-nature-50"
                          style={{ fontSize: "0.8rem" }}
                        >
                          標籤
                        </p>
                      </div>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        <span className="px-2 py-1 rounded-2 text-black bg-nature-95 fs-Caption">
                          {game.game_dif_tagname}
                        </span>
                        <span className="px-2 py-1 rounded-2 text-black bg-nature-95 fs-Caption">
                          {game.game_main_tag1name}
                        </span>
                        <span className="px-2 py-1 rounded-2 text-black bg-nature-95 fs-Caption">
                          {game.game_main_tag2name}
                        </span>
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

export default AdminGame;
