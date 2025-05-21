import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import ParticipatingGroup from "./ParticipatingGroup";
import MyComments from "./MyComments";
import { userContext } from "../../reducers/createContent";

function UserProfile() {
  const { user, user_token } = useSelector((state) => state.userInfo);
  const { user_id, activedefaultTab } = useParams();
  const [isAuthMySelf, setIsAuthMySelf] = useState(false);
  const [activeTab, setActiveTab] = useState(activedefaultTab);

  const checkMySelf = useCallback(() => {
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
  }, [user?.user_id, user_id, user_token]);

  useEffect(() => {
    checkMySelf();
    setActiveTab(activedefaultTab)

  }, [user_id, activedefaultTab, checkMySelf]);

  return (
    <>
      {isAuthMySelf ? (
        <>
          <div className="custom-profileMain flex-grow-1">
            <div className="container-fluid bg-primary-99">
              <div className="container-lg ">
                <div className="row pt-10 ">
                  <ul className="d-flex">
                    <li >
                      <Link
                        className={`custom-profileTab fs-lg-h6 fs-Body-1 lh-base lh-lg-normal fw-bold ${activeTab === "basicInfo" ? "active" : ""} `}
                        to={`/User_profile/${user_id}/basicInfo`}
                      >
                        基本資訊
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`custom-profileTab fs-lg-h6 fs-Body-1 lh-base lh-lg-normal fw-bold ${activeTab === "participatingGroup" ? "active" : ""} `}
                        to={`/User_profile/${user_id}/participatingGroup`}
                      >
                        參加的揪團
                      </Link>
                    </li>
                    <li >
                      <Link
                        className={`custom-profileTab fs-lg-h6 fs-Body-1 lh-base lh-lg-normal fw-bold ${activeTab === "myComments" ? "active" : ""} `}
                        to={`/User_profile/${user_id}/myComments`}
                      >
                        留下的評論
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="">
                <div className="container-lg">
                  <div className="row m-0 flex-column flex-md-row g-5 justify-content-center align-items-center">
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
          </div>


        </>
      ) :
        (<div className="my-md-10 my-sm-0">
          <div className="container-lg">
            <div className="row flex-column flex-md-row g-0">
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