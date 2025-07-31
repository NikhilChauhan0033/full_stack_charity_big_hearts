// reusable Button component

const Button = ({ text, icon, onClick, className }) => {
  return (
    <button onClick={onClick} className={className}>
      {text}
      {icon && (
        <span className="ml-2">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
