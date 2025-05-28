import React from 'react'
import AddressAndPayment from '../../components/addToCart/AddressandPayment'
import MyBasket from '../../components/addToCart/MyBasket'
import Navbar from '../../components/layout/Navbar';

const AddToCart = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row mt-20 gap-6 p-6">
        <div className="w-full lg:w-2/3">
          <AddressAndPayment />
        </div>
        <div className="w-full lg:w-1/3">
          <MyBasket />
        </div>
      </div>
    </>
  );
};


export default AddToCart;