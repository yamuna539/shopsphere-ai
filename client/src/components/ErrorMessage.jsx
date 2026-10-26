const ErrorMessage = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div
      className="alert alert-danger d-flex justify-content-between align-items-center"
      role="alert"
    >
      <span>{message}</span>

      {onRetry && (
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;