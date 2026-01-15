import React from 'react'
import Navbar from '../../components/layout/Navbar'
import MeatSection from '../../components/Meat/Home/MeatSection'
import MeatStoresSection from '../../components/Meat/Home/MeatStoreCard'

const Home = () => {
  return (
    <>
        <Navbar />
        <MeatSection />
        <MeatStoresSection />
    </>
  )
}

export default Home