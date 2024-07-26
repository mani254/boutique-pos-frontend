import React from "react";
import SearchComponent from "../SearchComponent/SearchComponent";

function Header() {
  return (
    <div>
      <div className="flex items-center justify-between rounded-md border-b-4 border-violet-50 bg-white p-2">
        <SearchComponent />
        <div className="flex items-center">
          <p className="mr-3">Manikanta</p>
          <img
            className="w-10 rounded-full border-2 border-gray-200"
            src="/images/user-image.png"
            alt="user profile"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
