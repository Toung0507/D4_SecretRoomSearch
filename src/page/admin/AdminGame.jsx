import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminGame() {
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    const getGameData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gamesData`);
        setGameData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getGameData();
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
              <span className="fs-Body-2 fw-bold text-nature-50">密室管理</span>
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
              標籤
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
              id="role"
            >
              <option defaultValue>全部狀態</option>
              <option value="member">處理中</option>
              <option value="store">通過</option>
              <option value="admin">已退回</option>
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
                  <th className="px-4 py-3 text-center">評分</th>
                  <th className="px-4 py-3 text-center">評論人數</th>
                  <th className="px-4 py-3">標籤</th>
                  <th className="px-4 py-3 text-center">狀態</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {gameData.map((row) => (
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
                    {/* TODO 加上 上/下架 真實資料 */}
                    <td className="py-2 px-4 text-center">
                      <span className="px-2 py-1 rounded-2 text-black bg-pass">
                        上架
                      </span>
                    </td>
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

export default AdminGame;
