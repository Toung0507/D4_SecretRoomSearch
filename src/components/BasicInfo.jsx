import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { userContext } from "../page/UserProfile";
import { Modal } from "bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUserInfoAsyncThunk, updateUser } from "../redux/slices/userInfoSlice";
import { FaFacebook } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { pushMessage } from "../redux/slices/toastSlice";
import Toast from "../layout/Toast";

const baseApi = import.meta.env.VITE_BASE_URL;

const BasicInfo = () => {
    const dispatch = useDispatch();

    // FROM 表單驗證相關 - useForm
    const { register: userInfo, handleSubmit: handleSubmitUser, formState: { errors: userErrors } } = useForm();  // 處理user

    // 共用的資料 - useContext
    const { user } = useContext(userContext); //共用的user資料

    // 此元件使用 
    const [formData, setFormData] = useState(user); //是否資料有變動 > 儲存(有/無)變動過的資料
    const [isFormChanged, setIsFormChanged] = useState(false);  // 是否資料有變動 > 布林值
    const [passwordError, setPasswordError] = useState("尚未驗證");

    // modal ref
    const updatePawwordModalRef = useRef(null); //驗證密碼
    const updateInputPawwordModalRef = useRef(null); //修改密碼
    const authpasswordRef = useRef(null); //
    const inputpasswordRef = useRef(null); //

    // 按下儲存變更後的處理 - 更新user資料
    const onSubmitUser = handleSubmitUser((data) => {
        const user_id = user.user_id;
        const updateUser2 = async (data) => {
            data["user_update_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
            try {
                await axios.patch(`${baseApi}/usersData/${user_id}`, data);
                try {
                    const res = await axios.get(`${baseApi}/usersData/${user_id}`);
                    dispatch(updateUser(res.data));
                    setIsFormChanged(false);
                } catch (error) {
                    const message = error.response.data;
                    dispatch(pushMessage({
                        text: message,
                        status: 'failed'
                    }));
                }
            } catch (error) {
                const message = error.response.data;
                dispatch(pushMessage({
                    text: message,
                    status: 'failed'
                }));
            }
        }
        //確保有變動在更新，不包含更新密碼的部分
        if (isFormChanged) {
            updateUser2(data);
        }
    });

    // 當表單數據更動時更新資料及更改表單是否修改狀態
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = {
                ...prevData, [name]: value
            };
            setIsFormChanged(JSON.stringify(updatedData) !== JSON.stringify(formData));
            return updatedData;
        });
    };

    // 驗證輸入的密碼前的密碼是否有正確
    const handleAuthPassword = async () => {
        const user_email = user.user_email;
        const user_password = authpasswordRef.current.value;
        const data = {
            user_email,
            user_password
        }
        const res = await dispatch(getUserInfoAsyncThunk(data));
        if (res.meta.requestStatus === 'fulfilled') {
            openupdateInputPawword();
            handleHideUpdatePasswordtModal();
            setPasswordError("請輸入新密碼");
            authpasswordRef.current.value = '';
        }
        else {
            setPasswordError(res.payload === '信箱及密碼需要輸入' || res.payload === '密碼請超過4碼' ? '請輸入密碼驗證或密碼未超過4碼' : res.payload);
        }

    };

    // 驗證輸入的密碼是否有錯誤
    const handleNewInputPassword = async () => {
        const user_password = inputpasswordRef.current.value;
        const data = {
            user_password
        }
        const user_id = user.user_id;
        data["user_update_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
        try {
            await axios.patch(`${baseApi}/usersData/${user_id}`, data);
            dispatch(pushMessage({
                text: '修改密碼成功\n下次登入請使用新密碼',
                status: 'success'
            }));
            setPasswordError("尚未驗證");
            inputpasswordRef.current.value = '';
            // 延遲關閉 Modal，確保訊息顯示
            setTimeout(() => {
                handleHideupdateInputPawwordtModal();
            }, 3000);
        } catch (error) {
            console.log(error);
        }

    };

    // 顯示Modal - 刪除
    const openUpdatePassword = () => {
        const modalInstance = Modal.getInstance(updatePawwordModalRef.current);
        modalInstance.show();
    };

    // 隱藏Modal - 刪除
    const handleHideUpdatePasswordtModal = () => {
        const modalInstance = Modal.getInstance(updatePawwordModalRef.current);
        modalInstance.hide();
    };

    // 顯示Modal - 刪除
    const openupdateInputPawword = () => {
        const modalInstance = Modal.getInstance(updateInputPawwordModalRef.current);
        modalInstance.show();
    };

    // 隱藏Modal - 刪除
    const handleHideupdateInputPawwordtModal = () => {
        const modalInstance = Modal.getInstance(updateInputPawwordModalRef.current);
        modalInstance.hide();
    };

    useEffect(() => {
        new Modal(updatePawwordModalRef.current, {
            backdrop: false
        }); //從boostrap裡面來的

        new Modal(updateInputPawwordModalRef.current, {
            backdrop: false
        }); //從boostrap裡面來的
    }, []);

    return (
        <>
            {/* 主畫面 */}
            <div className="col-8 m-0 pt-10 px-0 ">
                <div className=" border-nature-90 border-1 border">
                    <div className="basicInfoTitle fs-h6 lh-sm bg-secondary-95 fw-bold px-5 py-6 text-secondary-50" >
                        會員資料
                    </div>
                    <div className="user-info bg-white ">
                        <div className="user_name d-flex px-6 py-sm-5 py-4 align-items-center border-nature-90 border-1 border-top border-bottom" >
                            <img
                                src={user.user_sex === '男' ? './icon/man.png' : user.user_sex === '女' ? './icon/woman.png' : './icon/user.png'}
                                alt={user.user_name}
                                className="rounded-circle"
                                style={{
                                    width: "14%",
                                    objectFit: "cover",
                                    aspectRatio: "1/1",
                                }}
                            />
                            <h5 className="ps-5 fw-bold">{user.user_name}</h5>
                        </div>
                        <div className="user_information p-6 ">
                            <form className="text-start" onSubmit={onSubmitUser} id="userinfoform">
                                {/* 姓名 */}
                                <div className="row mb-1">
                                    <label htmlFor="user_name" className="col-sm-2">姓名</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...userInfo('user_name', { required: "姓名欄位必填" })}
                                            type="text"
                                            className={`form-control ${userErrors.user_name && 'is-invalid'}`}
                                            id="user_name"
                                            name="user_name"
                                            placeholder="請輸入姓名或暱稱"
                                            value={formData.user_name}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {userErrors.user_name ? userErrors.user_name.message : "　"}
                                        </div>
                                    </div>

                                </div>
                                {/* 信箱 */}
                                <div className="row  mb-1">
                                    <label htmlFor="user_email" className="col-sm-2">信箱</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...userInfo('user_email', { required: "信箱欄位必填" })}
                                            type="email"
                                            className="form-control"
                                            id="user_email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleInputChange}
                                        />
                                        <button className="text-secondary-50 bg-transparent border-0 border-bottom pt-1 " onClick={openUpdatePassword}>修改密碼</button>
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {userErrors.user_email ? userErrors.user_email.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 性別 */}
                                <div className="row mb-1">
                                    <label htmlFor="user_sex" className="col-sm-2">性別</label>
                                    <div className="col-sm-10">
                                        <select
                                            className={`form-select ${userErrors.user_sex && 'is-invalid'}`}
                                            aria-label="Default select example"
                                            {...userInfo('user_sex', {
                                                required: "性別欄位必填",
                                                validate: (value) =>
                                                    value !== '請選擇性別' || "請選擇性別",
                                            })}
                                            value={formData.user_sex}
                                            onChange={handleInputChange}
                                        >
                                            <option value="請選擇性別">請選擇性別</option>
                                            <option value="男">男</option>
                                            <option value="女">女</option>
                                            <option value="不提供">不提供</option>
                                        </select>
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {userErrors.user_email ? userErrors.user_email.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 電話 */}
                                <div className="row mb-1">
                                    <label htmlFor="user_tel" className="col-sm-2">電話</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...userInfo('user_tel', {
                                                pattern: {
                                                    value: /^(0[2-8]-\d{7,8}|09\d{8})$/,
                                                    message: "市話格式為02-12345678手機格式為0912456789"
                                                }
                                            })}
                                            type="tel"
                                            className={`form-control ${userErrors.user_tel && 'is-invalid'}`}
                                            id="user_tel"
                                            name="user_tel"
                                            value={formData.user_tel}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error-message text-danger mt-1">
                                            {userErrors.user_tel ? userErrors.user_tel.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 第三方登入icon */}
                                <div className="row mb-5">
                                    <label htmlFor="user_email" className="col-sm-2">第三方登入</label>
                                    <div className="col-sm-10">
                                        <FaFacebook size={24} className="me-3" />
                                        <FaGoogle size={24} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* 按鈕區 */}
                        <div className="ps-6 py-4 border-nature-90 border-1 border-top">
                            <div className="btn_2 d-flex  text-center ">
                                <button type="reset" className="btn bg-nature-60 text-white me-6" disabled={!isFormChanged} form="userinfoform">
                                    取消更改
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-secondary-60 text-white"
                                    form="userinfoform"
                                    disabled={!isFormChanged}  // 根據表單是否更動來決定按鈕是否可點擊
                                >
                                    儲存變更
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toast />
            </div>
            {/* 驗證密碼MODAL */}
            <div
                ref={updatePawwordModalRef}
                className="modal fade m-0"
                id="updatePawwordModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-secondary-95 flex-column align-items-start">
                            <h4 className="modal-title fw-bold mb-2">修改密碼</h4>
                            <p>請先輸入目前密碼進行驗證</p>
                        </div>
                        <div className="modal-body px-5 py-10">
                            <input type="password" className="w-100 border border-1 border-black rounded-1 " ref={authpasswordRef} />
                            <div className={`error-message ${passwordError === '尚未驗證' ? 'text-secondary-40' : 'text-danger'}  mt-1 fs-caption lh-1`}>
                                {passwordError}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="btn_2 d-flex  text-center ">
                                <button type="button" className="btn bg-nature-60 text-white me-6" onClick={handleHideUpdatePasswordtModal}>
                                    取消更改
                                </button>
                                <button type="button" className="btn bg-secondary-60 text-white" onClick={handleAuthPassword}>
                                    下一步
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {/* 修改密碼MODAL */}
            < div
                ref={updateInputPawwordModalRef}
                className="modal fade m-0"
                id="updatePawwordModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }
                }
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-secondary-95">
                            <h4 className="modal-title fw-bold ">修改密碼</h4>
                        </div>
                        <div className="modal-body px-6 py-10">
                            <input type="password" className="w-100 border border-1 border-black rounded-1 " ref={inputpasswordRef} />
                            <div className={`error-message ${passwordError === '尚未驗證' ? 'text-secondary-40' : 'text-danger'}  mt-1 fs-caption lh-1`}>
                                {passwordError}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="btn_2 d-flex  text-center ">
                                <button type="button" className="btn bg-nature-60 text-white me-6" onClick={handleHideupdateInputPawwordtModal}>
                                    取消更改
                                </button>
                                <button type="button" className="btn bg-secondary-60 text-white" onClick={handleNewInputPassword}                                >
                                    儲存變更
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>

    )
};

export default BasicInfo;