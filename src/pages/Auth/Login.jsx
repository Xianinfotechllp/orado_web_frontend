import React from "react";
import Navbar from "../../components/layout/Navbar";
import deliveryBoy from "../../assets/deliveryBoy.png"
function Login() {
  return (
    <div>
      <Navbar />

      <div>
        <div className="flex flex-1  flex-colmd:flex-row  h-screen">
          {/* Left side */}
          <div className=" w-full md:w-1/2  flex flex-col px-4 py-6 md:px-10 md:py-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-800  mb-4">
                Hungry again?{" "}
                <span className="text-[#EA4424]"> Log in for </span> <br />
                <span className="text-[#EA4424]"   >   quick </span>        delivery
       
              </h1>
              <h4 className=" text-gray-500">Welcome back! Please login to your account.</h4>
            </div>

            <div className="flex flex-col gap-5 mt-6">
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-300 p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424]"
              />

              <input
                type="text"
                placeholder="Password"
                             className="border border-gray-300 p-3 rounded outline-none w-full focus:border-l-4 focus:border-[#EA4424]"
              />
             

              <div className="flex items-center justify-between mt-3 text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-[#EA4424]"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>

                <button className="text-[#EA4424] hover:underline">
                  Forgot Password?
                </button>
              </div>
            </div>
<div className="flex  gap-5 mt-8">
  <button className="bg-[#EA4424] px-8 py-2 text-white" >Login</button>
  <button className="px-8 py-2 border-[#EA4424] border text-[#EA4424]">Signup</button>
</div>

          </div>

          <div className="hidden md:block w-1/2 bg-[#FDFCDB] h-screen">
          
           <img src={deliveryBoy} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
