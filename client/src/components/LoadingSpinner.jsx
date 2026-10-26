const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border"
        role="status"
        aria-hidden="true"
      />

      <p className="mt-3 mb-0 text-muted">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;