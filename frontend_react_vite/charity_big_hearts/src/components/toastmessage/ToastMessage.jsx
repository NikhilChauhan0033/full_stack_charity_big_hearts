const ToastMessage = ({ message, type }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white transition-transform transform ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
