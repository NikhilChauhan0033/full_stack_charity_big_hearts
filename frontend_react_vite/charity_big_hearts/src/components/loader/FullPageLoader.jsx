import { CircularProgress } from "@mui/material";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
      <CircularProgress size={60} thickness={4} sx={{ color: "#F74F22" }} />
    </div>
  );
};

export default FullPageLoader;