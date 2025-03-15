import { useEffect, useState, useRef } from "react";
import axios from "axios";
import GroupCard from "../layout/GroupCard";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const area = [
  { area_name: "台北市", area_value: "taipei" },
  { area_name: "基隆市", area_value: "keelung" },
  { area_name: "新竹市", area_value: "hsinchu" },
  { area_name: "彰化縣", area_value: "changhua" },
  { area_name: "嘉義市", area_value: "chiayi" },
  { area_name: "高雄市", area_value: "kaohsiung" },
  { area_name: "宜蘭縣", area_value: "yilan" },
  { area_name: "台東縣", area_value: "taidong" },
  { area_name: "新北市", area_value: "newtaipei" },
  { area_name: "桃園市", area_value: "taoyuan" },
  { area_name: "台中市", area_value: "taichung" },
  { area_name: "南投縣", area_value: "nantou" },
  { area_name: "台南市", area_value: "tainan" },
  { area_name: "屏東縣", area_value: "pingtung" },
  { area_name: "花蓮縣", area_value: "hualien" },
  { area_name: "澎湖金門馬祖", area_value: "PenghuKinmenMatsu" },
];

const formData = {
  order: "order_price",
  game_name: "",
  area: [],
  game_people: "",
  difficulty: [],
  property: [],
};

function TeamBuy() {
  // 原先的資料
  const [games, setGames] = useState([]);
  const [difficultys, setDifficultys] = useState([]);
  const [propertys, setPropertys] = useState([]);
  const [maxPeople, setMaxPeople] = useState(0);
  const [search, setSearch] = useState(formData);
  const [group, setGroup] = useState([]);

  // 是否要顯示全部資料
  const [isAllRecommendDisplay, setIsAllRecommendDisplay] = useState(false);
  const [isAllRecentlyDisplay, setIsAllRecentlyDisplay] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isHaveResultGames, setIsHaveResultGames] = useState(false);
  // 排序過後的資料
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [newedGames, setNewedGames] = useState([]);
  const [searchGames, setSearchGames] = useState([]);

  // 建立一個 ref 指向搜尋區塊
  const firstSectionRef = useRef(null);

  // axios拿到全部遊戲資料
  const getGames = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/gamesData`);
      setGames(res.data);

      const recommendedGames = [...res.data].sort(
        (a, b) => b.game_score - a.game_score
      );
      setRecommendedGames(recommendedGames);

      const newGames = [...res.data].sort(
        (a, b) => new Date(b.game_start_date) - new Date(a.game_start_date)
      );
      setNewedGames(newGames);
      setMaxPeople(Math.max(...res.data.map((p) => p.game_maxNum_Players)));
    } catch (error) {
      console.error(error);
    }
  };

  // axios拿到全部標籤資料
  const getPropertys = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/propertys_fixed_Data`);
      setPropertys(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // axios拿到全部難度資料
  const getDifficultys = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/difficultys_fixed_Data`);
      setDifficultys(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 查看更多推薦
  const handleSeeRecommendMore = () => {
    if (isAllRecommendDisplay) {
      setIsAllRecommendDisplay(false);
    } else {
      setIsAllRecommendDisplay(true);
    }
    window.scrollTo(0, 0); // 滾動到頁面頂部
  };

  const handleReset = () => {
    setSearch(formData);
    setIsSearch(false);
  };

  // 監聽表單輸入況狀
  const handlEInputChange = (e) => {
    const { value, name } = e.target;
    if (name == "area" || name == "difficulty" || name == "property") {
      setSearch((prev) => ({
        ...prev,
        [name]: prev[name].includes(value)
          ? prev[name].filter((item) => item !== value) // 如果已經選擇，就移除
          : [...prev[name], value], // 如果沒選擇，就加入
      }));
    } else {
      setSearch({
        ...search,
        [name]: value,
      });
    }
  };

  // 處理篩選後的結果呈現
  const handleSerach = async (e) => {
    e.preventDefault(); // 可用此方式將預設行為取消掉，讓使用者可以直接按enter就可進入，不限制只透過按鈕點選
    setIsSearch(true);
    const filteredGames = group.filter(({ group, game }) => {
      // 遊戲名稱
      const matchesGameName =
        search.game_name === ""
          ? true
          : group.game_name.includes(search.game_name);

      // 地區篩選（使用OR條件）
      const matchesArea =
        search.area.length === 0
          ? true
          : search.area.some((area) => group.game_address.startsWith(area));

      // 遊玩人數篩選
      const matchesGamePeople =
        search.game_people === ""
          ? true
          : group.group_member.includes(search.game_people);

      // 難度篩選（使用OR條件）
      const matchesDifficulty =
        search.difficulty.length === 0
          ? true
          : search.difficulty.includes(String(game.game_dif_tag));

      // 屬性篩選（使用OR條件）
      const matchesProperty =
        search.property.length === 0
          ? true
          : search.property.some(
              (property) =>
                String(game.game_main_tag1).includes(property) ||
                String(game.game_main_tag2).includes(property)
            );

      // 綜合判斷，使用AND邏輯
      return (
        matchesGameName &&
        matchesArea &&
        matchesGamePeople &&
        matchesDifficulty &&
        matchesProperty
      );
    });

    if (filteredGames.length === 0) {
      setIsHaveResultGames(false);
    } else if (filteredGames.length > 0) {
      setIsHaveResultGames(true);
    }

    // 排序資料
    setSearchGames(
      filteredGames.sort((a, b) => {
        if (search.order === "order_price") {
          // 價格排序（由大到小）
          return b.game_min_price - a.game_min_price;
        } else if (search.order === "order_popularity") {
          return b.game_score_num - a.game_score_num;
        }

        return 0; // 如果沒有匹配的排序條件，返回原順序
      })
    );

    // 搜尋完成後，利用 ref 捲動到搜尋區塊
    if (firstSectionRef.current) {
      firstSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //根據共同的 ID關聯
  const fetchGroupGames = async () => {
    try {
      // 同時發送三個 axios 請求
      const [groupRes, userRes, gameRes] = await Promise.all([
        axios.get(`${BASE_URL}/groupsData`),
        axios.get(`${BASE_URL}/usersData`),
        axios.get(`${BASE_URL}/gamesData`),
      ]);
      // axios 的回應資料在 res.data 中
      const groupData = groupRes.data;
      const userData = userRes.data;
      const gameData = gameRes.data;

      // 建立 game 與 user 的映射表，以便依據 ID 快速查找
      const gameMap = gameData.reduce((acc, game) => {
        acc[game.game_id] = game;
        return acc;
      }, {});

      const userMap = userData.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});

      // 將三個 API 的資料依據 game 中的 group_id 與 user_id 合併成一個物件
      const groupGames = groupData.map((group) => ({
        group,
        game: gameMap[group.game_id], // 利用 group.game_id 取得對應的群組資料
        user: userMap[group.user_id], // 利用 group.user_id 取得對應的使用者資料
      }));
      setGroup(groupGames);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    getGames();
    getPropertys();
    getDifficultys();
    fetchGroupGames();
  }, []);

  return (
    <>
      <div className="banner">
        <picture>
          <source
            media="(min-width: 992px)"
            srcSet="./illustration/CTA-lg.png"
          />
          <img
            src="./illustration/CTA.png"
            alt="banner"
            className="rounded mx-auto d-block"
          />
        </picture>
      </div>
      <div className="my-md-10 my-sm-0">
        <div className="container-lg">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">揪團專區</h5>
                  <ol className="card-text list-group list-group-numbered">
                    <li className="list-group-item">
                      發起揪團請至密室介紹頁點選揪團去開啟揪團吧
                    </li>
                    <li className="list-group-item">
                      請勿發表與密室逃脫無關之內容
                    </li>
                    <li className="list-group-item">禁止一切交易買賣行為</li>
                    <li className="list-group-item">請勿暴雷</li>
                    <li className="list-group-item">
                      禁止相同或類似之內容重複張貼洗版
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="row d-flex flex-column flex-md-row g-0">
            {/* <!-- 表單部分 --> */}
            <div className="col-md-3 pe-lg-6 pe-md-3 ">
              <form className="p-4 bg-white" onSubmit={(e) => handleSerach(e)}>
                <div className="order">
                  <p className="h5 pb-3  fw-bold">排序條件</p>
                  <div className="mb-6">
                    <div className="form-check form-check-inline ">
                      <input
                        onChange={handlEInputChange}
                        className="form-check-input"
                        defaultChecked={true}
                        type="radio"
                        name="order"
                        id="order_price"
                        value="order_price"
                      />
                      <label className="form-check-label" htmlFor="order_price">
                        價格(由高到低)
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        onChange={handlEInputChange}
                        className="form-check-input"
                        type="radio"
                        name="order"
                        id="order_popularity"
                        value="order_popularity"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="order_popularity"
                      >
                        人氣
                      </label>
                    </div>
                  </div>
                </div>
                <div className="search">
                  <p className="h5 pb-3  fw-bold">遊戲名稱</p>
                  <div className="search-all-group mb-6">
                    <label htmlFor="" className="pb-1">
                      搜尋
                    </label>
                    <div className=" input-group search-group border  rounded-1  border-primary-black">
                      <input
                        onChange={handlEInputChange}
                        type="text"
                        className="form-control border-0 search-input"
                        placeholder="搜尋關鍵字"
                        aria-label="Search"
                        name="game_name"
                        value={search.game_name}
                      />
                      <span className="input-group-text search-input border-0">
                        <a href="">
                          <i className="bi bi-search"></i>
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                {/* <!-- 地區、人數 --> */}
                <div className="d-flex  w-100  ">
                  <div className="row w-100 row1 flex-md-column">
                    <div className="col-6 col-md-12 col1 ">
                      <div className="area">
                        <p className="h5 pb-4  fw-bold">遊戲地區</p>
                        {/* <!-- 手機板下拉式選單 --> */}
                        <select
                          onChange={handlEInputChange}
                          className="form-select d-md-none mb-md-6 mb-3 border  rounded-1  border-primary-black"
                          aria-label="Default select example"
                          name="area"
                          value={search.area.length > 0 ? search.area[0] : ""}
                        >
                          <option defaultValue>請選擇遊玩地區</option>
                          {area.map((item, index) => (
                            <option key={index} value={item.area_name}>
                              {item.area_name}
                            </option>
                          ))}
                        </select>
                        {/* <!-- 電腦版checkbox --> */}
                        <div className="row m-0 mb-6 d-none d-md-flex">
                          <div className="col-md-6 mx-0 p-0 w-auto">
                            {area
                              .slice(0, area.length / 2)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="form-check mb-4 me-6"
                                >
                                  <input
                                    onChange={handlEInputChange}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={item.area_name}
                                    id={item.area_value}
                                    name="area"
                                    checked={search.area.includes(
                                      item.area_name
                                    )}
                                  />
                                  <label
                                    className="form-check-label text-nowrap"
                                    htmlFor={item.area_value}
                                  >
                                    {item.area_name}
                                  </label>
                                </div>
                              ))}
                          </div>
                          <div className="col-md-6 m-0 p-0">
                            {area.slice(area.length / 2).map((item, index) => (
                              <div className="form-check mb-4 " key={index}>
                                <input
                                  onChange={handlEInputChange}
                                  className="form-check-input"
                                  type="checkbox"
                                  value={item.area_name}
                                  id={item.area_value}
                                  name="area"
                                  checked={search.area.includes(item.area_name)}
                                />
                                <label
                                  className="form-check-label text-nowrap"
                                  htmlFor={item.area_value}
                                >
                                  {item.area_name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-12 col1 ">
                      <div className="people">
                        <p className="h5 pb-4  fw-bold">遊玩人數</p>
                        <select
                          onChange={handlEInputChange}
                          className="form-select mb-md-6 mb-3 border  rounded-1  border-primary-black"
                          aria-label="Default select example"
                          name="game_people"
                          value={search.game_people}
                        >
                          <option defaultValue>請選擇遊玩人數</option>
                          {Array.from({ length: Number(maxPeople) }).map(
                            (_, index) => (
                              <option key={index} value={index + 1}>
                                {index + 1}人
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- 難度、主題 --> */}
                <div className="d-flex  w-100  ">
                  <div className="row w-100 row1 flex-md-column">
                    <div className="col-6 col-md-12 col1 ">
                      <div className="difficulty">
                        <p className="h5 pb-4  fw-bold">難度</p>
                        {/* <!-- 手機板下拉式選單 --> */}
                        <select
                          onChange={handlEInputChange}
                          className="form-select d-md-none mb-md-6 mb-3 border  rounded-1  border-primary-black"
                          aria-label="Default select example"
                          name="difficulty"
                          value={
                            search.difficulty.length > 0
                              ? search.difficulty[0]
                              : ""
                          }
                        >
                          <option defaultValue>請選擇難度</option>
                          {difficultys.map((difficulty) => (
                            <option
                              key={difficulty.difficulty_id}
                              value={difficulty.difficulty_id}
                            >
                              {difficulty.difficulty_name}
                            </option>
                          ))}
                        </select>

                        {/* <!-- 電腦版核取方塊 --> */}
                        <div className="row m-0 mb-6 d-none d-md-flex">
                          <div className="col-md-6 mx-0 p-0 w-auto">
                            {difficultys
                              .slice(0, Math.round(difficultys.length / 2))
                              .map((difficulty) => (
                                <div
                                  className="form-check mb-4 me-6"
                                  key={difficulty.difficulty_id}
                                >
                                  <input
                                    onChange={handlEInputChange}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={difficulty.difficulty_id}
                                    id={difficulty.difficulty_id}
                                    name="difficulty"
                                    checked={search.difficulty.includes(
                                      String(difficulty.difficulty_id)
                                    )}
                                  />
                                  <label
                                    className="form-check-label text-nowrap"
                                    htmlFor={difficulty.difficulty_id}
                                  >
                                    {difficulty.difficulty_name}
                                  </label>
                                </div>
                              ))}
                          </div>
                          <div className="col-md-6 m-0 p-0">
                            {difficultys
                              .slice(Math.round(difficultys.length / 2))
                              .map((difficulty) => (
                                <div
                                  className="form-check mb-4 "
                                  key={difficulty.difficulty_id}
                                >
                                  <input
                                    onChange={handlEInputChange}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={difficulty.difficulty_id}
                                    id={difficulty.difficulty_id}
                                    name="difficulty"
                                    checked={search.difficulty.includes(
                                      String(difficulty.difficulty_id)
                                    )}
                                  />
                                  <label
                                    className="form-check-label text-nowrap"
                                    htmlFor={difficulty.difficulty_id}
                                  >
                                    {difficulty.difficulty_name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-12 col1 ">
                      <div className="topic">
                        <p className="h5 pb-4  fw-bold">主題</p>
                        {/* <!-- 手機板下拉式選單 --> */}
                        <select
                          onChange={handlEInputChange}
                          className="form-select d-md-none mb-md-6 mb-3 border  rounded-1  border-primary-black"
                          aria-label="Default select example"
                          name="property"
                          value={
                            search.property.length > 0 ? search.property[0] : ""
                          }
                        >
                          <option defaultValue>請選擇主題類別</option>
                          {propertys.map((property) => (
                            <option
                              key={property.property_id}
                              value={property.property_id}
                            >
                              {property.property_name}
                            </option>
                          ))}
                        </select>

                        {/* <!-- 電腦版核取方塊 --> */}
                        <div className="row m-0 mb-6 d-none d-md-flex">
                          <div className="col-md-6 mx-0 p-0 w-auto">
                            {propertys
                              .slice(0, propertys.length / 2)
                              .map((property) => (
                                <div
                                  className="form-check mb-4 me-6"
                                  key={property.property_id}
                                >
                                  <input
                                    onChange={handlEInputChange}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={property.property_id}
                                    id={property.property_name}
                                    name="property"
                                    checked={search.property.includes(
                                      String(property.property_id)
                                    )}
                                  />
                                  <label
                                    className="form-check-label text-nowrap"
                                    htmlFor={property.property_name}
                                  >
                                    {property.property_name}
                                  </label>
                                </div>
                              ))}
                          </div>
                          <div className="col-md-6 m-0 p-0">
                            {propertys
                              .slice(propertys.length / 2)
                              .map((property) => (
                                <div
                                  className="form-check mb-4 "
                                  key={property.property_id}
                                >
                                  <input
                                    onChange={handlEInputChange}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={property.property_id}
                                    id={property.property_name}
                                    name="property"
                                    checked={search.property.includes(
                                      String(property.property_id)
                                    )}
                                  />
                                  <label
                                    className="form-check-label text-nowrap"
                                    htmlFor={property.property_name}
                                  >
                                    {property.property_name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button className="btn btn-secondary-60 link-white rounded-2 w-100">
                    搜尋
                  </button>
                </div>
              </form>
              <div className=" px-4">
                <button
                  onClick={handleReset}
                  className="btn w-100 reset_button border-0 text-primary-black fw-bold text-sm-center text-end"
                >
                  重置
                </button>
              </div>
            </div>
            {/* <!-- 遊戲卡片 --> */}
            <div className="col-md-9 p-0" ref={firstSectionRef}>
              {isSearch ? (
                <div className="search my-5 my-md-10 ">
                  <div className="title-container w-100  d-flex justify-content-center align-items-center">
                    <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                      依據您的搜尋/排序結果如下
                    </h3>
                  </div>
                  <div className="row m-0">
                    <div className="row m-0">
                      {isHaveResultGames ? (
                        searchGames
                          .filter(
                            ({ group }) =>
                              new Date(group.group_active_date) >= new Date()
                          )
                          .map(({ game, group, user }) => (
                            <GroupCard
                              game={game}
                              group={group}
                              user={user}
                              key={group.game_id}
                            />
                          ))
                      ) : (
                        <div className="text-center">
                          <p className="h4">
                            您輸入的條件未查詢到相符合結果
                            <br />
                            請放寬條件重新查詢
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="row m-0 mt-3">
                      <div className="title-container w-100  d-flex justify-content-center align-items-center">
                        <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                          相關推薦
                        </h3>
                      </div>
                      {/* 若 searchGames 中找不到相同 game_id 的項目，就保留該推薦 */}
                      {group
                        .slice(0, 4)
                        .filter(
                          ({ group }) =>
                            new Date(group.group_active_date) >= new Date()
                        )
                        .filter(({ game }) => {
                          return !searchGames.some(
                            (searchItem) =>
                              searchItem.game.game_id === game.game_id
                          );
                        })
                        .map(({ game, group, user }) => (
                          <GroupCard
                            game={game}
                            group={group}
                            user={user}
                            key={group.game_id}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!isAllRecentlyDisplay && (
                    <div className="recommend my-5 my-md-10">
                      <div className="title-container w-100 d-flex justify-content-center align-items-center">
                        <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                          揪團專區
                        </h3>
                      </div>
                      <div className="row m-0">
                        {isAllRecommendDisplay
                          ? group
                              .filter(
                                ({ group }) =>
                                  new Date(group.group_active_date) >=
                                  new Date()
                              )
                              .map(({ game, group, user }) => (
                                <GroupCard
                                  game={game}
                                  group={group}
                                  user={user}
                                  key={group.group_id}
                                />
                              ))
                          : group
                              .slice(0, 8)
                              .filter(
                                ({ group }) =>
                                  new Date(group.group_active_date) >=
                                  new Date()
                              )
                              .map(({ game, group, user }) => (
                                <GroupCard
                                  game={game}
                                  group={group}
                                  user={user}
                                  key={group.group_id}
                                />
                              ))}
                        <button
                          className={`btn btn-primary ${
                            isAllRecommendDisplay ? "d-none" : ""
                          }`}
                          onClick={() => handleSeeRecommendMore()}
                        >
                          查看更多揪團
                        </button>
                        <button
                          className={`btn btn-primary ${
                            isAllRecommendDisplay ? "" : "d-none"
                          }`}
                          onClick={() => handleSeeRecommendMore()}
                        >
                          顯示較少揪團
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default TeamBuy;
