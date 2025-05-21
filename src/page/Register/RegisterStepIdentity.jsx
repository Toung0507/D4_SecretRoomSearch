import { useContext } from "react";
import { FaUserCheck } from "react-icons/fa";
import { LuLaptopMinimalCheck } from "react-icons/lu";
import { FaInfoCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { registerInfo } from "../../reducers/createContent";

function RegisterStepIdentity() {
  const { handleUserChange, userRegister } = useContext(registerInfo);
  const role = userRegister.user_role;

  return (
    <>
      <div className="my-md-10 my-sm-3 my-5">
        <div className="container-lg">
          <div className="role row flex-column flex-md-row g-5 justify-content-center align-items-center">
            <p className="h2 text-center">
              歡迎來到密室搜搜
              <br />
              請慎選身分，註冊後，無法更改
            </p>
            <div className="col-lg-4">
              <div
                className="user"
                onClick={() => handleUserChange({ target: { name: "user_role", value: "會員" } })}
                style={{ cursor: "pointer" }}>
                <div className="card" >
                  <div className="card-body">
                    <h3 className="card-title " style={{ position: "relative" }}>
                      會員
                      {role === '會員' && <FaUserCheck size={30} className="text-secondary-60" style={{ top: 5, right: 10, position: "absolute" }} />}
                    </h3>
                    <hr />
                    <div className="d-flex flex-column justify-content-center align-items-start">
                      <ul className="text-start h4">
                        <li className="mb-5 ">
                          <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                          可瀏覽密室
                        </li>
                        <li className="mb-5">
                          <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                          可發起/參與揪團
                        </li>
                        <li>
                          <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                          可留上評論
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="col-lg-4">
              <div
                className="store"
                onClick={() => handleUserChange({ target: { name: "user_role", value: "店家" } })}
                style={{ cursor: "pointer" }}>
                <div className="card" >
                  <div className="card-body">
                    <h3 className="card-title " style={{ position: "relative" }}>
                      店家
                      {role === '店家' && <FaUserCheck size={30} className="text-secondary-60" style={{ top: 5, right: 10, position: "absolute" }} />}
                    </h3>
                    <hr />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <ul className="text-start  h4">
                        <li className="mb-5 text-start">
                          <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                          可編輯店內資訊
                        </li>
                        <li className="text-start">
                          <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                          可新增及編輯店內密室
                        </li>
                        <li className="h6 my-1 text-danger text-start">
                          < FaStar className="me-3" />
                          需通過審核後，方可使用上述功能
                        </li>
                        <li className="h6 my-1 text-danger text-start">
                          < FaInfoCircle className="me-3" />
                          若想發起/參與揪團，請申辦一般會員
                        </li>
                      </ul>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>



    </>
  )
};

export default RegisterStepIdentity;
