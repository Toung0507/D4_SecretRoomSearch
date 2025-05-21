import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Form, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Toast from "../layout/Toast";
import { pushMessage } from "../redux/slices/toastSlice";
import PropTypes from "prop-types";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AddGameComment() {
  const [isLoadingGame, setIsLoadingGame] = useState(true);
  // 注意：因為 state 為保留字，這邊用 mode 來接收
  const { state: mode, id } = useParams();
  const navigate = useNavigate();
  // 另外使用 currentMode 來記錄實際的模式，初始為 mode (通常為 "new")
  const [currentMode, setCurrentMode] = useState(mode);
  const [gameData, setGameData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  // 從 URL 中取得 state 與 id
  const { user, user_token } = useSelector((state) => state.userInfo);
  let user_id = "";
  const dispatch = useDispatch();
  if (user) {
    user_id = user.user_id;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      coment_star: 0,
      game_id: Number(id),
      user_id: user ? user.user_id : null,
      comment_isPass: null,
      comment_isSpoilered: null,
      coment_content: "",
      commet_played_time: "",
    },
  });

  // 單獨取得遊戲資料（若整合資料中尚未取得或需要補充）
  const fetchGameData = useCallback(async (gameId) => {
    setIsLoadingGame(true); // 開始 loading
    try {
      const res = await axios.get(`${BASE_URL}/gamesData/${gameId}`);
      const data = res.data;
      if (Array.isArray(data.game_img)) {
        data.game_img = data.game_img[0];
      }
      setGameData(data);
    } catch (error) {
      console.log("取得遊戲資料錯誤：", error.response.data?.errors[0]);
    } finally {
      setIsLoadingGame(false); // 結束 loading
    }
  }, []);

  // 根據傳入的評論識別碼取得評論資料，並更新表單初始值
  const fetchCommentData = useCallback(
    async (commentId) => {
      setIsLoadingGame(true);
      try {
        const res = await axios.get(`${BASE_URL}/commentsData/${commentId}`);
        const data = res.data;
        // 支援 comment_id 或 id
        const cid = data.comment_id || data.id;
        // 檢查該評論是否屬於當前使用者
        if (cid && data.user_id === user.user_id) {
          setCurrentMode("edit");
          setCommentData(data);
          await fetchGameData(data.game_id); // 總之再抓一次，確保最新
          reset({
            coment_star: data.coment_star,
            game_id: data.game_id,
            user_id: data.user_id,
            comment_isPass: data.comment_isPass,
            comment_isSpoilered: data.comment_isSpoilered,
            coment_content: data.coment_content,
            // 假設後端傳回的日期為 ISO 格式字串
            commet_played_time: data.commet_played_time.slice(0, 10),
          });
        } else {
          console.warn("取得的評論資料不符合當前使用者：", data);
        }
      } catch (error) {
        console.log("取得評論資料錯誤：", error.response.data?.errors[0]);
      } finally {
        setIsLoadingGame(false);
      }
    },
    [reset, user?.user_id, fetchGameData]
  );

  // 表單送出處理：若是新增則用 POST，若是編輯則用 Patch 更新
  const onSubmit = async (data) => {
    try {
      if (currentMode === "new") {
        await axios.post(`${BASE_URL}/commentsData`, data);
        reset();
        dispatch(
          pushMessage({
            text: "新增評論成功！",
            status: "success",
          })
        );
        setTimeout(() => {
          navigate(`/User_profile/${user_id}/myComments`);
        }, 3000);
      } else if (currentMode === "edit") {
        // 假設編輯評論的 API 為 Patch 到 /commentsData/{comment_id}
        await axios.patch(
          `${BASE_URL}/commentsData/${commentData.comment_id}`,
          data
        );
        dispatch(
          pushMessage({
            text: "更新評論成功！",
            status: "success",
          })
        );
        setTimeout(() => {
          navigate(`/User_profile/${user_id}/myComments`);
        }, 3000);
      }
    } catch (error) {
      const message = error.response.data?.errors[0]
        ? "送出資料時發生錯誤"
        : "";
      dispatch(
        pushMessage({
          text: message,
          status: "failed",
        })
      );
    }
  };

  const StarRating = ({ value, onChange }) => {
    return (
      <div className="custom-box">
        {[5, 4, 3, 2, 1].map((ratingValue) => [
          <input
            key={`input-${ratingValue}`}
            type="radio"
            id={`score${ratingValue}`}
            name="star"
            value={ratingValue}
            checked={value === ratingValue}
            onChange={() => onChange(ratingValue)}
          />,
          <label
            key={`label-${ratingValue}`}
            htmlFor={`score${ratingValue}`}
          ></label>,
        ])}
      </div>
    );
  };

  StarRating.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  useEffect(() => {
    const toLogin = () => {
      if (!user) {
        navigate(`/Login`);
      }
    };
    toLogin();
  }, [user, navigate]);

  useEffect(() => {
    // 取得所有評論、使用者與遊戲資料，並整合成一個陣列
    const fetchRelatedData = async () => {
      try {
        const [commentRes, userRes, gameRes] = await Promise.all([
          axios.get(`${BASE_URL}/commentsData`),
          axios.get(`${BASE_URL}/usersData`),
          axios.get(`${BASE_URL}/gamesData`),
        ]);
        const comments = commentRes.data; // 假設回傳為陣列
        const users = userRes.data;
        const games = gameRes.data;

        // 建立遊戲與使用者映射表
        const gameMap = games.reduce((acc, game) => {
          acc[game.game_id] = game;
          return acc;
        }, {});

        const userMap = users.reduce((acc, u) => {
          acc[u.user_id] = u;
          return acc;
        }, {});

        // 整合每筆評論，並將對應的遊戲與使用者資料放進去
        const integrated = comments.map((comment) => ({
          comment,
          game: gameMap[comment.game_id],
          user: userMap[comment.user_id],
        }));

        // 若是 new 模式，依據使用者與遊戲 id 過濾出符合的評論
        if (mode === "new" && user && id) {
          const matched = integrated.find(
            (item) =>
              item.comment.game_id === Number(id) &&
              item.comment.user_id === user.user_id
          );
          if (matched) {
            // 自動導向 edit 模式：URL 的 id 為該筆評論的 comment_id
            navigate(`/Game_comment/edit/${matched.comment.comment_id}`, {
              replace: true,
            });
          }
        }
      } catch (error) {
        console.log("取得相關資料錯誤：", error.response.data?.errors[0]);
      }
    };

    fetchRelatedData();
  }, [id, mode, user, navigate]); // ✅ 這樣 Lint 也不會報錯，且避免無窮迴圈

  useEffect(() => {
    // 若是 edit 模式（URL 的 id 為評論識別碼），直接取得該筆評論資料
    if (mode === "edit") {
      fetchCommentData(Number(id));
    } else if (mode === "new") {
      // 當 new 模式時，以 id 當作遊戲編號取得遊戲資料
      fetchGameData(Number(id));
    }
  }, [id, mode, fetchCommentData, fetchGameData]);

  if (user?.user_role === "店家") {
    return (
      <div className="container-fluid container-lg">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="pb-10">
              <h2 className="text-center">你是店家</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 把規則抽成常量，閱讀性高
  const VALID_RULES = {
    coment_star: {
      required: "請給整體評價",
      min: { value: 1, message: "評分最少 1 分" },
      max: { value: 5, message: "評分最多 5 分" },
    },
    commet_played_time: {
      required: "請填寫遊玩日期",
      validate: (value) => {
        const selected = new Date(value);
        const today = new Date();
        return selected <= today || "日期不可晚於今天";
      },
    },
    coment_content: {
      required: "請輸入心得內容",
      minLength: { value: 10, message: "至少輸入 10 個字" },
      maxLength: { value: 2000, message: "勿超過 2000 字" },
    },
  };

  // 若尚未取得遊戲資料則顯示 Loading
  if (isLoadingGame) {
    return <LoadingSpinner message="載入遊戲基本資料中" />;
  }

  return (
    <>
      {user_token && (
        <div className="bg-secondary-99">
          <div className="container-fluid container-lg">
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <div className="pb-10">
                  <picture className="ratio ratio-16x9">
                    <source
                      media="(min-width: 992px)"
                      src={`${gameData?.game_img}`}
                    />
                    <img
                      src={`${gameData?.game_img}`}
                      alt="banner"
                      className="w-100 img-fluid rounded-3"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </picture>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="py-10">
                      <h1 className="fs-lg-Display2 fs-h5 fw-bold">
                        遊戲名稱：{`${gameData?.game_name}`}
                      </h1>
                    </div>
                    <div className="mb-6">
                      <h2 className="fs-lg-h2 fs-h6 fw-bold">整體評價</h2>
                      <p className="py-3">
                        依據您遊玩的經驗，整體而言您會給這個遊戲幾分?
                      </p>
                      <Controller
                        name="coment_star"
                        rules={VALID_RULES.coment_star}
                        control={control}
                        render={({ field }) => (
                          <>
                            <StarRating
                              value={field?.value}
                              onChange={field.onChange}
                            />
                            {errors.coment_star && (
                              <p className="text-danger mt-1">
                                {errors.coment_star.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <div>
                        <div className="row mb-6">
                          <h2 className="fs-lg-h2 fs-h6 fw-bold">難度與特色</h2>
                          <div className="row py-3">
                            <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                              難度
                            </h3>
                            <div className="col-auto">
                              {`${gameData?.game_dif_tagname}`}
                            </div>
                          </div>
                          <div className="row py-3" id="input_3_2">
                            <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                              主題特色
                            </h3>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                              {`${gameData?.game_main_tag1name} ${gameData?.game_main_tag2name}`}
                            </div>
                          </div>
                        </div>
                        <div className="row mb-6">
                          <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                            遊玩日期
                          </h3>
                          <div className="col">
                            <input
                              type="date"
                              className={`form-control ${errors.commet_played_time && "is-invalid"
                                }`}
                              {...register(
                                "commet_played_time",
                                VALID_RULES.commet_played_time,
                                {
                                  pattern: {
                                    value:
                                      /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                                    message: "日期格式錯誤",
                                  },
                                }
                              )}
                            />
                            {errors.commet_played_time && (
                              <div className="invalid-feedback">
                                {errors.commet_played_time.message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row mb-6">
                          <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                            遊戲完成度
                          </h3>
                          <Controller
                            name="comment_isPass"
                            control={control}
                            rules={{
                              validate: (v) => v !== null || "請選擇是否通關",
                            }}
                            render={({ field }) => (
                              <>
                                <div className="col-auto">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadioSuccess"
                                    // 根據 field.value 判斷是否選取
                                    checked={field?.value === true}
                                    onChange={() => field.onChange(true)}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadioSuccess"
                                  >
                                    通關
                                  </label>
                                </div>
                                <div className="col-auto">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadioFail"
                                    checked={field?.value === false}
                                    onChange={() => field.onChange(false)}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadioFail"
                                  >
                                    未通關
                                  </label>
                                </div>
                                {errors.comment_isPass && (
                                  <p className="text-danger mt-1">
                                    {errors.comment_isPass.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="row mb-6">
                          <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                            心得是否有劇透（暴雷）？
                          </h3>
                          <Controller
                            name="comment_isSpoilered"
                            control={control}
                            rules={{
                              validate: (v) => v !== null || "請選擇是否含劇透",
                            }}
                            render={({ field }) => (
                              <>
                                <div className="col-auto">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions2"
                                    id="inlineRadioSuccess2"
                                    // 根據 field.value 判斷是否選取
                                    checked={field?.value === true}
                                    onChange={() => field.onChange(true)}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadioSuccess2"
                                  >
                                    是
                                  </label>
                                </div>
                                <div className="col-auto">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions2"
                                    id="inlineRadioFail2"
                                    checked={field?.value === false}
                                    onChange={() => field.onChange(false)}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadioFail2"
                                  >
                                    否
                                  </label>
                                </div>
                                {errors.comment_isSpoilered && (
                                  <p className="text-danger mt-1">
                                    {errors.comment_isSpoilered.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="row">
                          <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                            體驗心得
                          </h3>
                          <div className="col">
                            <textarea
                              className={`form-control ${errors.coment_content && "is-invalid"
                                }`}
                              rows="5"
                              {...register(
                                "coment_content",
                                VALID_RULES.coment_content
                              )}
                            />
                            <label
                              htmlFor="experience"
                              className="form-label"
                            ></label>
                            {errors.coment_content && (
                              <div className="invalid-feedback">
                                {errors.coment_content.message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col d-grid gap-2">
                          <button
                            type="submit"
                            className="btn custom-commentBtn btn-secondary-60 link-white rounded-1"
                          >
                            {currentMode === "new" ? "送出評論" : "更新評論"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toast />
    </>
  );
}
export default AddGameComment;
