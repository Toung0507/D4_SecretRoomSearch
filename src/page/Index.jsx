import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";


import 'swiper/swiper-bundle.css';

const BASE_URL = 'https://new-json.onrender.com/';

function Index() {
    const [product, setProduct] = useState([]);
    const [gameProperty, setGameProperty] = useState([]);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${BASE_URL}gamesData`);
                setProduct(res.data);
                console.log(res.data);
            } catch (error) {
                alert('獲取產品失敗');
                console.log(`${BASE_URL}gamesData`, error.message);
            }
        }
        getProduct();
    }, [])

    useEffect(() => {
        const getProperty = async () => {
            try {
                const res = await axios.get(`${BASE_URL}propertys_fixed_Data`);
                setGameProperty(res.data);

            } catch (error) {
                alert('獲取遊戲屬性失敗');
                console.log(`${BASE_URL}propertys_fixed_Data`, error.message);
            }
        }
        getProperty();
    }, [])

    const area = [
        "台北", "新北", "桃園", "新竹", "苗栗", "台中",
        "彰化", "雲林", "嘉義", "台南", "高雄", "屏東"
    ];
    const memberNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '800px',
                    backgroundImage: `url(${'./illustration/Banner_web_up_1.png'}), url(${'./illustration/Banner-web-down-1.png'})`,
                    backgroundRepeat: 'no-repeat, no-repeat',
                    backgroundPosition: 'top center, bottom center',
                    backgroundSize: 'contain, contain'
                }}
                className="row justify-content-center align-items-center vh-100 mt-20"
            >
                <div className="col-6 bg-primary-95 rounded-6">
                    <div className="p-12">
                        <div className="d-flex gap-3">
                            <div className="w-50">
                                <label htmlFor="" className="form-label">地點</label>
                                <div className="input-group bg-white">
                                    <button className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">{area[0]}</button>
                                    <ul className="dropdown-menu">
                                        {area.map((area) => (
                                            <li key={area}><span className="dropdown-item" href="#">{area}</span></li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                            <div className="w-50">
                                <label htmlFor="" className="form-label">人數</label>
                                <div className="input-group bg-white">
                                    <button className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">{memberNum[0]}</button>
                                    <ul className="dropdown-menu">
                                        {memberNum.map((num) => (
                                            <li key={num}><span className="dropdown-item" href="#">{num}</span></li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div className="w-100">
                            <label htmlFor="" className="form-label">搜尋</label>
                            <input type="text" className="form-control " placeholder="搜尋關鍵字" />

                        </div>
                    </div>

                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-8">
                        {product.slice(0, 3).map((game) => (
                            <div className={`d-flex justify-content-between align-items-center gap-3 mb-4 ${game.game_id % 2 !== 0 && 'flex-row-reverse'}`} key={game.game_id}>
                                <img src={game.game_img[0]} alt="123" className="w-50" />
                                <div>
                                    <h3>{game.game_name}</h3>
                                    <p>{game.game_info}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="index-content-2 bg-nature-20 py-20 mb-20">
                    <div className="container">
                        <h2 className="text-white text-align-center d-flex justify-content-center mb-20">從驚悚到奇幻，12 種冒險領域讓你選擇！</h2>
                        <div className="row justify-content-center flex-column-reverse flex-lg-row align-items-center">
                            <div className="col-lg-3 col-sm-12">
                                <img src="./assets/images/illustration/Friends-celebrating-the-New-Year-1.png" alt="" />
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-6">
                                    <div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
                                        <span className="material-symbols-outlined">child_care</span>
                                        <p className="fs-lg-h6">新手入門</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-6">
                                    <div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
                                        <span className="material-symbols-outlined">editor_choice</span>
                                        <p className="fs-lg-h6">中度玩家</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-6">
                                    <div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
                                        <span className="material-symbols-outlined">award_star</span>
                                        <p className="fs-lg-h6">重度解謎</p>
                                    </div>
                                </div>
                                {gameProperty.slice(0, 9).map((property) => (
                                    <div className="col-lg-4 col-6">
                                        <div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
                                            <span className="material-symbols-outlined">editor_choice</span>
                                            <p className="fs-lg-h6">{property.property_name}</p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={4}
                    spaceBetween={24}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }
                    }
                    pagination={{ clickable: true, el: ".swiper-pagination" }}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                >
                    {/* 輪播 */}
                    {product.map((game) => (
                        <SwiperSlide key={game.game_id}>
                            <img src={game.game_img[0]} alt="123" className="w-100 object-fit contain" style={{ height: '200px' }} />
                            <p>{game.game_info}</p>
                        </SwiperSlide>
                    ))}

                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </Swiper>

            </div>
        </>
    );
}
export default Index;