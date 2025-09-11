// src/components/toastmessage/ToastMessage.jsx
const ToastMessage = ({ message, type }) => {
  if (!message) return null; // don't render if no message

  return (
    <div
      className={`
        fixed top-5 right-5 z-[9999] px-4 py-2 rounded-lg shadow-lg text-white
        ${type === "success" ? "bg-green-600" : ""}
        ${type === "error" ? "bg-red-600" : ""}
        ${type === "info" ? "bg-blue-600" : ""}
      `}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
