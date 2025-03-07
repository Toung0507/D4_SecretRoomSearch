import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Form } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Game_comment() {
    const [gamesData, setGamesData] = useState([]);

    const game_id = 1;

    const getGamesData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/gamesData/${game_id}`);
            const data = res.data;
            // 只取第一張圖片
            data.game_img = data.game_img[0];
            setGamesData(res.data);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGamesData();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm({
        defaultValues: {
            coment_star: 0, // 預設評分值
            game_id,
        },
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        const {
            coment_content,
            comment_isPass,
            comment_isSpoilered,
            commet_played_time,
            game_id,
            coment_star,
        } = data;
        const commentsData = {
            coment_content,
            comment_isPass,
            comment_isSpoilered,
            commet_played_time,
            game_id,
            coment_star,
        };
        // coment_content,
        //   comment_isPass,
        //   comment_isSpoilered,
        //   commet_played_time,
        //   game_id,
        //   rating

        // checkout(commentsData);
    });

    // const onSubmit = handleSubmit((data) => {
    //   const { message, ...user } = data;

    //   const userInfo = {
    //     data: {
    //       user,
    //       message,
    //     },
    //   };
    //   checkout(userInfo);
    // });

    // const checkout = async (data) => {
    //   try {
    //     await axios.post(`${BASE_URL}/commentsData`, data);
    //     reset();
    //   } catch (error) {
    //     alert(error);
    //     console.log(error);
    //   }
    // };

    const StarRating = ({ value, onChange }) => {
        return (
            <div className="box">
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

    return (
        <>
            <div className="container-fluid container-lg">
                <div className="rol d-flex justify-content-center">
                    <div className="col-xl-10">
                        <div className="pb-10">
                            <picture>
                                <source
                                    media="(min-width: 992px)"
                                    src={`${gamesData.game_img}`}
                                />
                                <img
                                    src={`${gamesData.game_img}`}
                                    alt="banner"
                                    className="w-100"
                                />
                            </picture>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <div className="py-10">
                                    <h1 className="fs-lg-Display2 fs-h5 fw-bold">
                                        遊戲名稱：{`${gamesData.game_name}`}
                                    </h1>
                                </div>
                                <div className="mb-6">
                                    <h2 className="fs-lg-h2 fs-h6 fw-bold">整體評價</h2>
                                    <p className="py-3">
                                        依據您遊玩的經驗，整體而言您會給這個遊戲幾分?
                                    </p>
                                    <Controller
                                        name="coment_star"
                                        control={control}
                                        render={({ field }) => (
                                            <StarRating
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <div>
                                        <div className="row mb-6">
                                            <h2 className="fs-lg-h2 fs-h6 fw-bold">難度與特色</h2>
                                            <div className="row py-3">
                                                <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">難度</h3>
                                                <div className="col-auto">
                                                    {`${gamesData.game_dif_tagname}`}
                                                </div>
                                            </div>
                                            <div className="row py-3" id="input_3_2">
                                                <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                                                    主題特色
                                                </h3>
                                                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                                    {`${gamesData.game_main_tag1name} ${gamesData.game_main_tag2name}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-6">
                                            <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                                                遊玩日期
                                            </h3>
                                            <div className="col-12">
                                                <input
                                                    type="date"
                                                    className={`form-control ${errors.date && "is-invalid"
                                                        }`}
                                                    {...register("commet_played_time", {
                                                        required: "日期欄位必填",
                                                        pattern: {
                                                            value:
                                                                /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                                                            message: "日期格式錯誤",
                                                        },
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-6">
                                            <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                                                遊戲完成度
                                            </h3>
                                            <div className="col-auto">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadioSuccess"
                                                    value="true"
                                                    {...register("comment_isPass", {
                                                        required: { value: Boolean },
                                                    })}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="inlineRadioSuccess"
                                                >
                                                    過關
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadioFail"
                                                    value="false"
                                                    {...register("comment_isPass", {
                                                        required: { value: Boolean },
                                                    })}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="inlineRadioFail"
                                                >
                                                    未通關
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row mb-6">
                                            <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                                                心得是否有劇透（暴雷）？
                                            </h3>
                                            <div className="col-auto">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadioSuccess"
                                                    value="true"
                                                    {...register("comment_isSpoilered", {
                                                        required: { value: Boolean },
                                                    })}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="inlineRadioSuccess"
                                                >
                                                    是
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadioFail"
                                                    value="false"
                                                    {...register("comment_isSpoilered", {
                                                        required: { value: Boolean },
                                                    })}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="inlineRadioFail"
                                                >
                                                    否
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                                                體驗心得
                                            </h3>
                                            <div className="col-12">
                                                <textarea
                                                    className={`form-control ${errors.message && "is-invalid"
                                                        }`}
                                                    id="experience"
                                                    rows="5"
                                                    {...register("coment_content")}
                                                ></textarea>
                                                <label
                                                    htmlFor="experience"
                                                    className="form-label"
                                                ></label>
                                            </div>
                                        </div>
                                        <div className="col-12 d-grid gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-secondary-60 link-white rounded-1"
                                            >
                                                送出
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Game_comment;
