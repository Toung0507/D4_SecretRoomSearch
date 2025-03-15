import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Game_content() {
  const { gameID } = useParams();
  const [game, setGame] = useState(null);
  const [price, setPrice] = useState(null);

  // 推薦遊戲 (目前先以 ID 前後的遊戲代替)
  // TODO 實作推薦遊戲
  const [preGame, setPreGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // 回到頁面頂部
    const getGameData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gamesData/${gameID}`);
        setGame(res.data);
      } catch (error) {
        console.error("無法獲取遊戲資料", error);
      }
    };
    const getPriceData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/gamesData/${gameID}/pricesData`
        );
        setPrice(res.data);
      } catch (error) {
        console.error("無法獲取價格資料", error);
      }
    };
    getGameData();
    getPriceData();

    const getPreGameData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/gamesData/${Number(gameID) - 1}`
        );
        setPreGame(res.data);
      } catch (error) {
        console.error("無法獲取前一個遊戲資料", error);
      }
    };
    const getNextGameData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/gamesData/${Number(gameID) + 1}`
        );
        setNextGame(res.data);
      } catch (error) {
        console.error("無法獲取下一個遊戲資料", error);
      }
    };
    getPreGameData();
    getNextGameData();
  }, [gameID]);

  if (!game) return <div>載入中...</div>; // TODO 換成 loading 畫面

  return (
    <main className="game_content position-relative">
      <div className="info container py-6 py-lg-10">
        <picture>
          {/* TODO 圖片 RWD 替代方案 */}
          <source
            media="(min-width: 992px)"
            // srcset="/assets/images/julia-kadel.png"
          />
          <img
            className="w-100 rounded"
            src={game.game_img[0]}
            alt="banner"
            style={{ maxHeight: "432px", objectFit: "cover" }}
            // TODO 圖片裁切與對齊問題
          />
        </picture>
        <div className="my-6 my-lg-10">
          <h1 className="fs-h5 fs-lg-Display2 fw-bold mb-4">
            {game.game_name}
          </h1>
          <div className="mb-4 d-flex align-items-center">
            <img className="me-1" src="./icon/star.png" alt="star" />
            <p className="fs-Body-2 d-inline border-end border-nature-80 mb-0 me-2 pe-3">
              {game.game_score}
            </p>
            <p className="fs-Body-2 mb-0 d-inline">
              {game.game_score_num} 人評論
            </p>
          </div>
          <ul className="d-flex gap-2">
            <li className="bg-nature-95 text-black px-2 py-1 d-flex align-items-center rounded-pill">
              <span className="material-symbols-outlined me-1">child_care</span>
              <p className="fs-Body-2 mb-0">{game.game_dif_tagname}</p>
            </li>
            <li className="bg-nature-95 text-black px-2 py-1 d-flex align-items-center rounded-pill">
              <span className="material-symbols-outlined me-1">factory</span>
              <p className="fs-Body-2 mb-0">{game.game_main_tag1name}</p>
            </li>
            <li className="bg-nature-95 text-black px-2 py-1 d-flex align-items-center rounded-pill">
              <span className="material-symbols-outlined me-1">
                editor_choice
              </span>
              <p className="fs-Body-2 mb-0">{game.game_main_tag2name}</p>
            </li>
          </ul>
        </div>
        <div className="row row-cols-1 row-cols-lg-2 gx-6 gy-3">
          <div className="col">
            <div className="border border-nature-90 border-lg-nature-70 rounded-4 p-4">
              <h6 className="fs-h6 fw-bold text-primary-20 mb-3">基本資訊</h6>
              <ul>
                <li className="mb-2 d-flex align-items-center">
                  <img
                    src="./icon/person.png"
                    alt="person"
                    className="me-3"
                    style={{ width: "16px" }}
                  />
                  <p className="fs-Body-2 mb-0 text-break">
                    {game.game_minNum_Players} ~ {game.game_maxNum_Players}人
                  </p>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <img src="./icon/time.png" alt="time" className="me-3" />
                  <p className="fs-Body-2 mb-0 text-break">
                    {game.game_time} 分鐘
                  </p>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <img
                    src="./icon/address.png"
                    alt="address"
                    className="me-3"
                  />
                  <p className="fs-Body-2 mb-0 text-break">
                    {game.game_address}
                  </p>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <img src="./icon/link.png" alt="link" className="me-3" />
                  <a href="#" className="fs-Body-2 mb-0 text-break">
                    {game.game_website}
                  </a>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <img src="./icon/phone.png" alt="phone" className="me-3" />
                  <a
                    className="fs-Body-2 mb-0 text-break"
                    href={`tel:+886${game.game_tel}`}
                  >
                    {game.game_tel}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col">
            <div className="border border-nature-90 border-lg-nature-70 rounded-4 p-4">
              <h6 className="fs-h6 fw-bold text-primary-20 mb-3">參考價格</h6>
              <ul className="d-flex flex-column gap-2">
                {price?.map((item) => {
                  return (
                    <li key={item.price_id} className="fs-Body-2">
                      {item.price_day_type === "weekday" ? "平日" : "假日"}
                      {item.price_people}：${item.price_mix}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="discribe bg-nature-20">
        <div className="container py-10 py-lg-16 d-flex flex-column align-items-center align-items-lg-start">
          <div className="title position-relative d-flex flex-column align-items-center align-items-lg-start">
            <h2 className="text fs-h6 fs-lg-h3 text-primary-95 fw-bold mb-4">
              遊戲介紹
            </h2>
            {/* TODO 解決長方形裝置無法解釋 */}
            <div className="rectangle bg-nature-30 rounded position-absolute"></div>
          </div>
          <p className="d-lg-none text-white text-center mb-11">
            {/* 平板以下文字 */}
          </p>
          <p className="d-none d-lg-block fs-h6 text-white text-start mb-20">
            {/* TODO 文字無換行問題 (從資料庫中就沒有換行) */}
            {game.game_info}
          </p>
          <div className="comment container px-0">
            <ul className="row row-cols-1 row-cols-md-2 row-cols-lg-3 d-flex justify-content-center">
              {/* TODO 新增留言假資料 */}
              <li className="comment-item mb-6">
                <div className="user px-4 mb-2 d-flex align-items-center">
                  <img
                    className="image me-3 object-fit-cover rounded-circle"
                    src="/comment/1.png"
                    alt=""
                  />
                  <p className="name text-white fw-bold">王小美</p>
                </div>
                <div className="triangle mx-6"></div>
                <div className="content bg-nature-95 rounded-4 p-3 p-lg-5">
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column align-items-start">
                      <p className="date">2024/03/17</p>
                      <ul className="d-flex gap-2">
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/half-star.png" alt="" />
                        </li>
                      </ul>
                    </div>
                    <p className="tag rounded bg-primary-90 px-2 py-1">
                      #無劇透
                    </p>
                  </div>
                  <p className="fs-Body-2">
                    首先進去踩下去的第一個場景真的覺得太不可思議馬上就懂為什麼需要脫模子。從第一個肆題就覺得很有巧思，，而後進入到古墓更覺得很不可思議，除了空間轉換真的讓我們玩案⋯
                  </p>
                </div>
              </li>
              <li className="comment-item mb-6">
                <div className="user px-4 mb-2 d-flex align-items-center">
                  <img
                    className="image me-3 object-fit-cover rounded-circle"
                    src="/comment/2.png"
                    alt=""
                  />
                  <p className="name text-white fw-bold">李錦</p>
                </div>
                <div className="triangle mx-6"></div>
                <div className="content bg-nature-95 rounded-4 p-3 p-lg-5">
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column align-items-start">
                      <p className="date">2024/03/17</p>
                      <ul className="d-flex gap-2">
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/half-star.png" alt="" />
                        </li>
                      </ul>
                    </div>
                    <p className="tag rounded bg-primary-90 px-2 py-1">
                      #無劇透
                    </p>
                  </div>
                  <p className="fs-Body-2">
                    遊玩過程可以求救五次的機會，差點把關卡設施用壞，小幫手很害怕地制止我們XD
                    <br />
                    極限通關，整體來說不錯玩
                    <br />
                    但希望設施可以好一點，不要看起來那麼舊
                  </p>
                </div>
              </li>
              <li className="comment-item mb-6">
                <div className="user px-4 mb-2 d-flex align-items-center">
                  <img
                    className="image me-3 object-fit-cover rounded-circle"
                    src="/comment/3.png"
                    alt=""
                  />
                  <p className="name text-white fw-bold">陳欣妤</p>
                </div>
                <div className="triangle mx-6"></div>
                <div className="content bg-nature-95 rounded-4 p-3 p-lg-5">
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column align-items-start">
                      <p className="date">2023/08/28</p>
                      <ul className="d-flex gap-2">
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/half-star.png" alt="" />
                        </li>
                      </ul>
                    </div>
                    <p className="tag rounded bg-primary-90 px-2 py-1">
                      #無劇透
                    </p>
                  </div>
                  <p className="fs-Body-2">
                    推推，可以去玩一下，流程順暢、線索也滿好找的。彩蛋可能要花點時間去特別找按鍵式手機上也有線索，記得要帶老一點的朋友去遊玩
                  </p>
                </div>
              </li>
              <li className="comment-item mb-6 mb-lg-0">
                <div className="user px-4 mb-2 d-flex align-items-center">
                  <img
                    className="image me-3 object-fit-cover rounded-circle"
                    src="/comment/4.png"
                    alt=""
                  />
                  <p className="name text-white fw-bold">潘橡義</p>
                </div>
                <div className="triangle mx-6"></div>
                <div className="content bg-nature-95 rounded-4 p-3 p-lg-5">
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column align-items-start">
                      <p className="date">2023/12/16</p>
                      <ul className="d-flex gap-2">
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                      </ul>
                    </div>
                    <p className="tag rounded bg-primary-90 px-2 py-1">#劇透</p>
                  </div>
                  <p className="fs-Body-2">
                    來體驗全台最逼真場景！ 真的在開一輛車 我是坐副駕 <br />
                    <br />
                    場景：
                    <br />
                    有真的車就是逼真！除此之外的場景就是普通正常~場景昏暗，線索字都看不清楚
                    <br />
                    <br />
                    謎題：
                    <br />
                    一開始題目幾乎都在坐中段及車尾的位置，頭腦擔當建議選這些位置，前座就是負責開車跟驚嚇第一排②題目難度中等，是需要思考的。
                    <br />
                    尤其進到第3個空間後的題目，思考一陣子 知道怎麼解。
                    <br />
                    有需要團體合作稍稍分開進行的部分，不會難但建議至少有一個坦才好進行...
                  </p>
                </div>
              </li>
              <li className="comment-item">
                <div className="user px-4 mb-2 d-flex align-items-center">
                  <img
                    className="image me-3 object-fit-cover rounded-circle"
                    src="/comment/5.png"
                    alt=""
                  />
                  <p className="name text-white fw-bold">方永烈</p>
                </div>
                <div className="triangle mx-6"></div>
                <div className="content bg-nature-95 rounded-4 p-3 p-lg-5">
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column align-items-start">
                      <p className="date">2022/04/05</p>
                      <ul className="d-flex gap-2">
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                        <li>
                          <img src="/icon/star.png" alt="" />
                        </li>
                      </ul>
                    </div>
                    <p className="tag rounded bg-primary-90 px-2 py-1">
                      #無劇透
                    </p>
                  </div>
                  <p className="fs-Body-2">
                    不愧是年度最佳遊戲第二名，場景跟機關都相當用心。
                    <br />
                    很多那種平常玩恐怖遊戲中會有的橋段當遣種遊戲內會發生的事情—一發生在現實中，就會覺得超級酷的！
                    <br />
                    謎題有些可能不夠直觀，但隨著進度小天使都會出來做補充。
                    <br />
                    完全沒有鎖頭的全機關密室，喜歡恐怖主題的一定不能錯過。
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="others py-10">
        {/* TODO 推薦遊戲 */}
        <div className="title position-relative d-flex flex-column align-items-center">
          <h2 className="text fs-h6 fs-lg-h3 fw-bold mb-7 mb-lg-12">
            您可能喜歡的遊戲
          </h2>
          <div className="rectangle bg-primary-80 rounded position-absolute"></div>
        </div>
        <div className="container">
          {preGame && nextGame && (
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              <SwiperSlide>
                <Link to={`/Game_content/${preGame.game_id}`}>
                  <img
                    className="image w-100 rounded-3 rounded-lg-8"
                    src={preGame.game_img[0]}
                    alt={preGame.game_name}
                  />
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link to={`/Game_content/${nextGame.game_id}`}>
                  <img
                    className="image w-100 rounded-3 rounded-lg-8"
                    src={nextGame.game_img[0]}
                    alt={nextGame.game_name}
                  />
                </Link>
              </SwiperSlide>
            </Swiper>
          )}
        </div>
      </div>

      <div className="add-comment position-fixed z-1">
        <Link
          to={`/Game_comment/new/${game.game_id}`}
          className="border border-none bg-primary-95 p-3 p-lg-4 rounded-circle"
        >
          <span className="material-symbols-outlined d-block text-primary-60">
            add_comment
          </span>
        </Link>
      </div>
    </main>
  );
}

export default Game_content;
