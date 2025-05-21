import ReactLoading from "react-loading";
import PropTypes from "prop-types";

const LoadingSpinner = ({ message }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.3)",
        zIndex: 999,
      }}
    >
      <p>
        {message}...
        <br />
      </p>
      <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default LoadingSpinner;
