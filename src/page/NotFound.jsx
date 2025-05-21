import { Link } from "react-router-dom";
import { AiFillAlert } from "react-icons/ai";

const NotFound = () => {
  return (
    <div className="container">
      <div className="text-center my-5">
        <h1 className="fs-h4 fs-md-h3 fw-bold mb-5">404</h1>
        <p className="fs-h5 lh-1 d-flex align-items-center justify-content-center">
          <AiFillAlert size={24} color="red" className="me-3" />
          Oops! 找不到你要的頁面
        </p>
        <Link to="/" className="fs-h6 btn btn-secondary-60 text-white mt-3">
          回首頁看看
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
