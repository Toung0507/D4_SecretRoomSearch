import { useContext } from "react";
import { registerInfo } from "../page/Register";
import { FaUserCheck } from "react-icons/fa";
import { LuLaptopMinimalCheck } from "react-icons/lu";
import { FaInfoCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

function RegisterOne() {
    const { handleUserChange, userRegister } = useContext(registerInfo);
    const role = userRegister.user_role;

    return (
        <>
            <div className="my-md-10 my-sm-3 my-5">
                <div className="container-lg">
                    <div className="role row d-flex flex-column flex-md-row g-5 justify-content-center align-items-center">
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
                                            {role === '會員' && <FaUserCheck size={30} className="text-primary" style={{ top: 5, right: 10, position: "absolute" }} />}
                                        </h3>
                                        <hr />

                                        <ul className="text-start ps-xl-15 ps-md-10 ps-5 h4">
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
                                                可留下評論
                                            </li>
                                        </ul>
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
                                            {role === '店家' && <FaUserCheck size={30} className="text-primary" style={{ top: 5, right: 10, position: "absolute" }} />}
                                        </h3>
                                        <hr />
                                        <p className="h6 my-1 text-danger">
                                            < FaInfoCircle className="me-5" />
                                            若想發起/參與揪團，請申辦一般會員
                                        </p>
                                        <p className="h5 my-1 text-info">
                                            < FaStar className="me-5" />
                                            需通過審核後，方可使用下述功能
                                        </p>
                                        <ul className="text-start ps-xl-15 ps-md-10 ps-5 h4">
                                            <li className="mb-5 ">
                                                <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                                                可編輯店內資訊
                                            </li>
                                            <li className="text-start">
                                                <LuLaptopMinimalCheck size={30} className="text-black me-5" />
                                                可新增及編輯店內密室
                                            </li>
                                        </ul>
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

export default RegisterOne;
