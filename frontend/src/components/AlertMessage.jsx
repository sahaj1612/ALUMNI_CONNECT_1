// Reusable alert component for showing success/error messages.
const AlertMessage = ({ message, type = "success" }) => {
  if (!message) {
    return null;
  }

  return <div className={`alert alert-${type}`}>{message}</div>;
};

export default AlertMessage;
