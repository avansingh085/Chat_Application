import React from "react";

const DotLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-white">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default DotLoader;
