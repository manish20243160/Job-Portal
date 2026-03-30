import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ fullPage = false, size = 48, color = "blue-600" }) => {
  const containerStyle = fullPage
    ? "min-h-screen flex items-center justify-center bg-white/50 backdrop-blur-sm fixed inset-0 z-[100]"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerStyle}>
      <div className="relative">
        <Loader2 size={size} className={`animate-spin text-${color}`} />
        <div className={`absolute inset-0 blur-xl bg-${color.replace('-600', '-400')}/20 rounded-full animate-pulse`}></div>
      </div>
    </div>
  );
};

export default Loader;
