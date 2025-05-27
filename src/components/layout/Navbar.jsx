import React from "react";
import logo from "../../assets/oradoLogo.png";

function Navbar() {
  return (
    <div className="w-full bg-white shadow-md py-4">
      <div className="flex items-center justify-between px-10">
        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Orado Logo" className="h-10 w-auto" />
          <span className="text-2xl font-semibold text-gray-800">Orado</span>
        </div>

     
      </div>
    </div>
  );
}

export default Navbar;
