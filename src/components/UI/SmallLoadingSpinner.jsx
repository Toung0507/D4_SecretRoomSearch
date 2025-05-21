import ReactLoading from "react-loading";
import PropTypes from "prop-types";

const SmallLoadingSpinner = ({ message }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
    >
      <p>
        {message}...
        <br />
      </p>
      <ReactLoading type="spin" color="black" width="1rem" height="1rem" />
    </div>
  );
};

SmallLoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default SmallLoadingSpinner;
