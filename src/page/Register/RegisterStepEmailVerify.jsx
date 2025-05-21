import { useContext, useEffect, useRef, useState } from "react";
import { registerInfo } from "../../reducers/createContent";
import { RiCloseCircleLine } from "react-icons/ri";
import { RiCheckboxCircleLine } from "react-icons/ri";

function RegisterStepEmailVerify() {
  const {
    handleUserChange,
    userRegister,
    isEmailAuth,
    setIsEmailAuth,
    isSend,
    setIsSend,
    verification_code,
    setVerification_code,
  } = useContext(registerInfo);
  const [orig_user_email] = useState(userRegister.user_email);
  const [orig_verification_code] = useState(verification_code);
  const [emailError, setEmailError] = useState("");

  const origUserEmailRef = useRef(orig_user_email);
  const origVerificationCodeRef = useRef(orig_verification_code);
  const verificationCodeRef = useRef(verification_code);

  // 檢查 Email 格式
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // 處理 Email 輸入變化
  const handleEmailChange = (e) => {
    const email = e.target.value;
    handleUserChange(e);
    if (!email) {
      setEmailError("Email欄位必填");
    } else if (!validateEmail(email)) {
      setEmailError("Email格式錯誤");
    } else {
      setEmailError("");
    }
  };

  // 送出驗證信
  const sendEmail = () => {
    setIsSend(true);
  };

  // 判斷驗證碼
  const auth_verification_code = (e) => {
    if (e.target.value === "123789") {
      setIsEmailAuth(true);
    } else {
      setIsEmailAuth(false);
    }
    setVerification_code(e.target.value);
  };

  useEffect(() => {
    // 確保信箱已被驗證
    const checkEmailAuth = () => {
      if (!userRegister.user_email || !verificationCodeRef.current) {
        return;
      }

      if (origUserEmailRef.current !== userRegister.user_email) {
        setIsSend(false);
        setIsEmailAuth(false);
        setVerification_code("");
      } else if (
        origUserEmailRef.current === userRegister.user_email &&
        origVerificationCodeRef.current !== undefined
      ) {
        setIsSend(true);
        setIsEmailAuth(true);
        setVerification_code(origVerificationCodeRef.current);
      }
    };

    checkEmailAuth();
  }, [
    userRegister.user_email,
    setIsEmailAuth,
    setIsSend,
    setVerification_code,
  ]); // ✅ 只在 userRegister.user_email 改變時觸發

  return (
    <div className="my-md-10 my-sm-3 my-5">
      <div className="role row flex-column flex-md-row g-5 justify-content-center align-items-center">
        <p className="h2 text-center">請驗證信箱</p>
        <form>
          <div className="row mb-3 justify-content-start">
            <label
              htmlFor="user_email"
              className="col-sm-2 col-form-label"
            >
              信箱
            </label>
            <div className="col-sm-6">
              <input
                type="email"
                className={`form-control ${emailError && "is-invalid pe-3"} w-100`}
                id="user_email"
                name="user_email"
                value={userRegister.user_email}
                onChange={(e) => handleEmailChange(e)}
              />
              <div className="error-message text-danger mt-1">
                {emailError || " "}
              </div>
            </div>
            <div className="col-sm-4 text-start ">
              <button
                className="btn btn-secondary-60 text-white"
                onClick={sendEmail}
                disabled={
                  isSend ||
                  userRegister.user_email === "" ||
                  emailError !== "" ||
                  userRegister.user_email === undefined
                }
              >
                {isSend ? "已寄送驗證信" : "發送驗證信件"}
              </button>
            </div>
          </div>
          <div className="row mb-3 mb-1">
            <label
              htmlFor="Verification_code"
              className="col-sm-2  col-form-label"
            >
              驗證碼
            </label>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control"
                id="Verification_code"
                onChange={(e) => auth_verification_code(e)}
                value={verification_code}
                disabled={isSend === false}
              />
            </div>
            <div className="col-sm-4 d-flex align-items-center">
              {isEmailAuth === true ? (
                <div className="text-success d-flex align-items-center">
                  <RiCheckboxCircleLine size={30} />
                  驗證完成
                </div>
              ) : (
                <div className="text-danger d-flex align-items-center">
                  <RiCloseCircleLine size={30} />
                  尚未驗證
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterStepEmailVerify;