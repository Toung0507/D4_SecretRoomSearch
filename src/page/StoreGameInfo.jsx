import axios from "axios";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const BASE_URL = 'https://new-json.onrender.com/';

function StoreGameInfo() {
    const { user } = useSelector((state) => state.userInfo);
    const user_id = user.user_id;
    const [product, setProduct] = useState([]);
    const [gameProperty, setGameProperty] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const navigateIndex = useNavigate();

    const [storeID, setStoreID] = useState(null);

    const getStoreID = async () => {
        try {
            const res = await axios.get(`${BASE_URL}storesData`);
            res.data.map((data) => {
                if (user_id === data.user_id) {
                    setStoreID(data.store_id);
                    return;
                }
            })
        } catch (error) {

        }
    }
    const getProduct = async () => {
        try {
            const res = await axios.get(`${BASE_URL}gamesData`);
            setProduct(res.data);
        } catch (error) {
            alert('獲取產品失敗');
            console.log(`${BASE_URL}gamesData`, error.message);
        }
    }
    const getProperty = async () => {
        try {
            const res = await axios.get(`${BASE_URL}propertys_fixed_Data`);
            setGameProperty(res.data);
        } catch (error) {
            alert('獲取遊戲屬性失敗');
        }
    }

    useEffect(() => {
        getProperty();
        getProduct();
        getStoreID();
    }, [])



    //上傳圖片
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setPostGameData((prev) => ({
                    ...prev,
                    game_img: [reader.result],
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    //上傳圖片style
    const styles = {
        container: {
            width: '600px',
            margin: '50px auto',
            fontFamily: 'Arial, sans-serif',
        },
        title: {
            fontSize: '24px',
            marginBottom: '20px',
            fontWeight: 'bold',
        },
        uploadBox: {
            width: '100%',
            height: '300px',
            border: '1px solid #ddd',
            backgroundColor: '#f7f8fa',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
        },
        placeholder: {
            textAlign: 'center',
            color: '#777',
        },
        uploadButton: {
            display: 'inline-block',
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#3399cc',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        previewImage: {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
        },
    };

    const [postGameData, setPostGameData] = useState({
        "store_id": storeID,
        "game_name": "",
        "game_address": "",
        "game_tel": "",
        "game_time": 0,
        "game_minNum_Players": 0,
        "game_maxNum_Players": 0,
        "game_dif_tag": 1,
        "game_main_tag1": 3,
        "game_main_tag2": 7,
        "game_score": 0,
        "game_img": [

        ],
        "game_isLimited": true,
        "game_start_date": "2024/12/31",
        "game_end_date": "",
        "game_info": "",
        "game_remark": "",
        "game_score_num": 0,
        "game_isStock": false,
        "game_website": "",
        "game_min_price": 500
    });


    const handleGameOnchange = async (e) => {
        const { name, value } = e.target;

        setPostGameData({
            ...postGameData,
            [name]: value,
            "store_id": storeID
        })
    }

    const updateGame = async () => {
        try {
            await axios.post(`${BASE_URL}gamesData`, postGameData);
            navigateIndex("/");
            window.scrollTo(0, 0);
        } catch (error) {

        }
    }

    useEffect(() => {
        // 頁面加載後滾動到頂部
        window.scrollTo(0, 0);
    }, []);


    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-10">
                        <h4 className="bg-secondary-95 text-secondary-50 py-3 px-6 mb-6">店家資訊</h4>
                        <div className="p-6">
                            <div className="border border-nature-90 p-6 rounded-3">
                                <div className="d-flex mb-7">
                                    <label htmlFor="" className="form-label" style={{ width: '100px' }}>店家名稱</label>
                                    <input type="text" className="form-control border border-black" placeholder="請輸入店家名稱" />
                                </div>
                                <div className="d-flex">
                                    <label htmlFor="" className="form-label" style={{ width: '100px' }}>店家網站</label>
                                    <input type="text" className="form-control border border-black" placeholder="請輸入店家網站" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-10">
                        <h4 className="bg-secondary-95 text-secondary-50 py-3 px-6">密室資訊</h4>
                        <div className="p-6">
                            <div className="border border-nature-90 rounded-3 mb-6">
                                <h4 className="bg-secondary-99 black py-3 px-6">基本資訊</h4>
                                <div className="p-6">
                                    <div className="d-flex mb-7">
                                        <label htmlFor="" className="form-label" style={{ width: '90px' }}>密室名稱</label>
                                        <input type="text" className="border border-black" placeholder="請輸入密室名稱" name="game_name" value={postGameData.game_name} onChange={handleGameOnchange} />
                                    </div>
                                    <div className="d-flex mb-7">
                                        <label htmlFor="" className="form-label" style={{ width: '90px' }}>密室地址</label>
                                        <input type="address" className="border border-black" placeholder="請輸入密室地址" name="game_address" value={postGameData.game_address} onChange={handleGameOnchange} />
                                    </div>
                                    <div className="d-flex mb-7">
                                        <label htmlFor="" className="form-label" style={{ width: '90px' }}>聯絡電話</label>
                                        <input type="tel" className="border border-black" placeholder="請輸入電話" name="game_tel" value={postGameData.game_tel} onChange={handleGameOnchange} />
                                    </div>
                                    <div className="d-flex mb-7">
                                        <label htmlFor="" className="form-label" style={{ width: '80px' }}>解謎時間</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <input type="number" className="border border-black" placeholder="請輸入時間" style={{ width: '160px' }} name="game_time" value={postGameData.game_time} onChange={handleGameOnchange} />
                                            <span>分鐘</span>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-7">
                                        <label htmlFor="" className="form-label" style={{ width: '80px' }}>遊玩人數</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <input type="number" className="border border-black" placeholder="0" style={{ width: '160px' }} name="game_minNum_Players" value={postGameData.game_minNum_Players} onChange={handleGameOnchange} />
                                            <span>至</span>
                                            <input type="number" className="border border-black" placeholder="10" style={{ width: '160px' }} name="game_maxNum_Players" value={postGameData.game_maxNum_Players} onChange={handleGameOnchange} />
                                            <span>人</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column mb-7">
                                        <label htmlFor="" className="form-label" style={{ width: '80px' }}>密室圖片</label>
                                        <div className="bg-secondary-99 w-100 py-20" style={styles.placeholder}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="預覽圖片" style={styles.previewImage} />
                                            ) : (
                                                <div style={styles.placeholder}>
                                                    <i className="bi bi-cloud-arrow-up" style={{ fontSize: '30px' }}></i>
                                                    <p>支援 PNG, JPG；圖片以 16:9 處理</p>
                                                    <label style={styles.uploadButton}>
                                                        上傳圖片
                                                        <input
                                                            type="file"
                                                            accept="image/png, image/jpeg"
                                                            style={{ display: 'none' }}
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-nature-90 rounded-3 mb-6">
                                <h4 className="bg-secondary-99 black py-3 px-6">主題分類</h4>
                                <div className="p-6">
                                    <div className="d-flex mb-7">
                                        <label htmlFor="" className="form-label me-6" style={{ width: '90px' }}>難度</label>
                                        <div className="form-check me-6">
                                            <input className="form-check-input" type="checkbox" name="game_dif_tag" value={postGameData.game_dif_tag} o />
                                            <label className="form-check-label" >
                                                新手入門
                                            </label>
                                        </div>
                                        <div className="form-check me-6">
                                            <input className="form-check-input" type="checkbox" name="game_dif_tag" value={postGameData.game_dif_tag} />
                                            <label className="form-check-label" >
                                                中度玩家
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="game_dif_tag" value={postGameData.game_dif_tag} />
                                            <label className="form-check-label" >
                                                重度解謎
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-7">
                                        <div className="d-flex flex-column me-6">
                                            <label htmlFor="" className="form-label fw-bold" style={{ width: '90px' }}>種類</label>
                                            <span className="text-nature-50 fz-3">請選擇兩種</span>
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            {gameProperty?.map((property) => (
                                                <div className="form-check me-6">
                                                    <input className="form-check-input" type="checkbox" value="" />
                                                    <label className="form-check-label" >
                                                        {property.property_name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <a type="button" href="/" className="bg-nature-60 text-white py-2 px-6 rounded-2">返回</a>
                                <button type="button" className="bg-secondary-60 text-white py-2 px-6 rounded-2 border-0" onClick={updateGame}>送出</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StoreGameInfo;