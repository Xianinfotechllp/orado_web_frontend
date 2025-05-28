import React from "react";
import cola1 from "../../assets/cola.png"
import cola2 from "../../assets/cola2.png"
function Menucard({item}) {
  return (
  
 <div className="w-[496px] h-[245px] bg-white rounded-2xl shadow-xl flex items-center justify-between px-4">
  <div className="flex-1 overflow-hidden">
    <h3 className="font-bold">{item.name}</h3>
    <h3 className="font-semibold mt-4 text-sm line-clamp-4">
    {item.description}
    </h3>
    <h5 className="mt-4 font-bold">₹ {item.price}</h5>
  </div>

  <div className="w-[180px] flex-shrink-0 ml-4">
    <img
      src={item.images ? item.images[0] : ""}
      alt=""
      className="rounded-2xl w-full h-[12em] object-cover"
    />
  </div>
</div>
  );
}

export default Menucard;
