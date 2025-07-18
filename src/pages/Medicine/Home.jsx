import React from 'react'
import Navbar from '../../components/layout/Navbar'
import MedicineSection from '../../components/Medicine/Home/MedicineSection'
import PharmacyStoresSection from '../../components/Medicine/Home/MedicineStoreCard'

const Home = () => {
  return (
    <>
        <Navbar />
        <MedicineSection />
        <PharmacyStoresSection /> 
    </>
  )
}

export default Home