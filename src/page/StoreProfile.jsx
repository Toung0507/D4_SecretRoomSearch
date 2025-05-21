import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import BasicStoreInfo from "../components/BasicStoreInfo";
import axios from "axios";
import MyGames from "../components/MyGames";
export const userStoreContext = createContext({});

const baseApi = import.meta.env.VITE_BASE_URL;

function StoreProfile() {
    const { user, user_token } = useSelector((state) => state.userInfo);
    const { user_id, activedefaultTab } = useParams();
    const [isAuthMySelf, setIsAuthMySelf] = useState(false);
    const [activeTab, setActiveTab] = useState(activedefaultTab);
    const [store, setStore] = useState({});

    // 判斷是否為本人
    const checkMySelf = () => {
        if (user_token) {
            if ((Number(user_id) === Number(user.user_id))) {
                setIsAuthMySelf(true);
            }
            else {
                setIsAuthMySelf(false);
            }
        }
        else {
            setIsAuthMySelf(false);
        }
    };

    const getStore = async () => {
        try {
            const res = await axios.get(`${baseApi}/usersData/${user_id}/storesData`);
            setStore(res.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStore();
    }, [])

    useEffect(() => {
        checkMySelf();
        setActiveTab(activedefaultTab)

    }, [user_id, activedefaultTab]);

    return (
        <>
            {isAuthMySelf ? (
                <>
                    <div className="container-fluid bg-primary-99">
                        <div className="container-lg ">
                            <div className="row pt-10 ">
                                <ul className="d-flex">
                                    <li className="">
                                        <Link
                                            className={` border-0 text-nature-70 bg-primary-99 fs-h6 ${activeTab === "basicStoreInfo" ? "member-nav-item-active" : ""} p-4`}
                                            to={`/Store_profile/${user_id}/basicStoreInfo`}
                                        >
                                            基本資訊
                                        </Link>
                                    </li>
                                    <li className="">
                                        <Link
                                            className={` border-0 text-nature-70 bg-primary-99 fs-h6 ${activeTab === "myGames" ? "member-nav-item-active" : ""} p-4`}
                                            to={`/Store_profile/${user_id}/myGames`}
                                        >
                                            密室總覽
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div className="container-fluid usermain">
                        <div className="">
                            <div className="container-lg">
                                <div className="row m-0 d-flex flex-column flex-md-row g-5 justify-content-center align-items-center">
                                    {/* 內容區塊 */}
                                    <userStoreContext.Provider value={{ user, store }}>
                                        {Object.keys(store).length > 0 && activeTab === "basicStoreInfo" && <BasicStoreInfo />}
                                        {Object.keys(store).length > 0 && activeTab === "myGames" && <MyGames />}
                                    </userStoreContext.Provider>
                                </div>
                            </div>
                        </div >
                    </div>

                </>
            ) :
                (<div className="my-md-10 my-sm-0">
                    <div className="container-lg">
                        <div className="row d-flex flex-column flex-md-row g-0">
                            <p className="h1 text-center" >尚未登入，或此頁面非您的會員ID</p>

                        </div>
                    </div>
                </div >
                )
            }
        </>
    )
};

export default StoreProfile;