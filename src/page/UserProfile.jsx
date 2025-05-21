import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import BasicInfo from "../components/BasicInfo";
import ParticipatingGroup from "../components/ParticipatingGroup";
import MyComments from "../components/MyComments";
export const userContext = createContext({});


function UserProfile() {
    const { user, user_token } = useSelector((state) => state.userInfo);
    const { user_id, activedefaultTab } = useParams();
    const [isAuthMySelf, setIsAuthMySelf] = useState(false);
    const [activeTab, setActiveTab] = useState(activedefaultTab);

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
                                            className={` border-0 text-nature-70 bg-primary-99 fs-h6 ${activeTab === "basicInfo" ? "member-nav-item-active" : ""} p-4`}
                                            to={`/User_profile/${user_id}/basicInfo`}
                                        >
                                            基本資訊
                                        </Link>
                                    </li>
                                    <li className="">
                                        <Link
                                            className={` border-0 text-nature-70 bg-primary-99 fs-h6 ${activeTab === "participatingGroup" ? "member-nav-item-active" : ""} p-4`}
                                            to={`/User_profile/${user_id}/participatingGroup`}
                                        >
                                            參加的揪團
                                        </Link>
                                    </li>
                                    <li className="">
                                        <Link
                                            className={`border-0 text-nature-70 bg-primary-99 fs-h6  ${activeTab === "myComments" ? "member-nav-item-active" : ""} p-4`}
                                            to={`/User_profile/${user_id}/myComments`}
                                        >
                                            留下的評論
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
                                    <userContext.Provider value={{ user }}>
                                        {activeTab === "basicInfo" && <BasicInfo />}
                                        {activeTab === "participatingGroup" && <ParticipatingGroup />}
                                        {activeTab === "myComments" && <MyComments />}
                                    </userContext.Provider>
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

export default UserProfile;