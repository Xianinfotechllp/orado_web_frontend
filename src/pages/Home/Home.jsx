import React from "react";
import Navbar from "../../components/layout/Navbar";
import HomeOrange from "../../assets/HomeOrange.png";
import homeGirlimage from "../../assets/homeGirl.png";
import Categorylist from "../../components/home/Categorylist";
import catgoryImage from "../../assets/category1.png"
import categoryImage1 from "../../assets/category2.png"
import categoryImage2 from "../../assets/category3.png"
import categoryImage3 from "../../assets/category4.png"
import categoryImage4 from "../../assets/category5.png"
import categoryImage5 from "../../assets/category6.png"
import RestaurantCard from "../../components/home/RestaurantCard";






function Home() {
  return (
    <div>
      <Navbar />
         {/* homeBanner */}
      <div className="flex flex-row ">
        <div className="w-full  mb-10 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Deliver Your <br />
            Delicious Food at <br />
            <span className="text-[#EA4424]">Lightning Speed</span>
          </h1>
        </div>
        {/* Right side */}
        <div className="relative w-full  flex justify-center ">
          {/* Orange Shape */}

          {/* <div className="relative w-full  flex justify-center items-center">
            <img src={HomeOrange} alt="" className="absolute w-[738px] h-[533px]" />
            <img
              src={homeGirlimage}
              alt="Girl Eating"
              className="w-[794px] h-[534px] relative z-10 right-20"
            />
          </div> */}
        </div>
      </div>

      {/* category  */}

        <p className="text-2xl font-bold">Popular catgories</p>
      <div className=" flex flex-wrap  gap-5">
        

        <Categorylist catgoryImage={catgoryImage} restaurantName={"Burgers & Fast food"}/>
        <Categorylist catgoryImage={categoryImage1}    restaurantName={"Salads"}  />

        <Categorylist catgoryImage={categoryImage2}   restaurantName={"Pasta & Casuals"}      />

        <Categorylist  catgoryImage={categoryImage3}  restaurantName={"Pizza"}   />
        <Categorylist  catgoryImage={categoryImage4}  restaurantName={"Breakfast"}   />
        <Categorylist  catgoryImage={categoryImage5}   restaurantName={"Soups"} />




      </div>

      <div className="overflow-x-auto whitespace-nowrap py-4 space-x-4 flex">

<RestaurantCard restaurant={{ images: [categoryImage5] }} /> 
      </div>
    </div>
  );
}

export default Home;
