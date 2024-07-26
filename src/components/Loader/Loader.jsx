import React from "react";

function Loader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative">
        <div className="h-9 w-9 rounded-full border-b-8 border-t-8 border-gray-200"></div>
        <div className="absolute left-0 top-0 h-10 w-10 animate-spin rounded-full border-b-8 border-t-8 border-violet-500"></div>
      </div>
    </div>
  );
}

export default Loader;
