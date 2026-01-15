import React from 'react'
import GrocerySection from '../../components/Groccery/home/GroccerySection'
import GroceryStoresSection from '../../components/Groccery/home/GrocceryStoreCard'
import Navbar from '../../components/layout/Navbar'

const Home = () => {
  return (
    <>
      <Navbar />
        <GrocerySection />
        <GroceryStoresSection />
    </>
  )
}

export default Home