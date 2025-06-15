
import { MapPin, Truck, Utensils, Pizza } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/oradoLogo.png"; 
export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
             <div className="flex items-center gap-3">
                    <img src={logo} alt="Orado Logo" className="h-10 w-auto" />
                    {/* <span className="text-2xl font-semibold text-gray-800">Orado</span> */}
                    <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Orado
              </span>
                  </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Title Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 relative z-10">
              DELIVERING
              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                HAPPINESS
              </span>
            </h1>
            {/* Floating food emojis */}
            <div className="absolute -top-4 -left-8 text-4xl animate-bounce">🍕</div>
            <div className="absolute -top-8 -right-4 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🍔</div>
            <div className="absolute -bottom-4 left-8 text-3xl animate-bounce" style={{animationDelay: '1s'}}>🍜</div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Amazing food, lightning-fast delivery, and incredible experiences for everyone in our ecosystem
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Delivery Partner Card */}
          <div className="group bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-12 right-16 w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-20 right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-8 left-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-16 left-12 w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Main Illustration */}
            <div className="relative z-10 flex justify-center mb-8">
              <div className="relative">
                {/* Delivery Scooter Scene */}
                <div className="w-56 h-40 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                  {/* Background Roads */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-700 opacity-20"></div>
                  <div className="absolute bottom-2 left-0 right-0 h-1 bg-white opacity-40"></div>
                  
                  {/* Delivery Person on Scooter */}
                  <div className="relative z-10">
                    {/* Scooter */}
                    <div className="w-16 h-12 bg-orange-500 rounded-lg relative shadow-lg">
                      <div className="absolute -top-3 left-2 w-8 h-8 bg-orange-600 rounded-full"></div>
                      <div className="absolute -bottom-2 left-1 w-4 h-4 bg-gray-800 rounded-full"></div>
                      <div className="absolute -bottom-2 right-1 w-4 h-4 bg-gray-800 rounded-full"></div>
                      <Truck className="w-6 h-6 text-white absolute top-1 left-5" />
                    </div>
                    
                    {/* Delivery Bag */}
                    <div className="absolute -top-8 -right-4 w-10 h-8 bg-red-500 rounded-lg shadow-lg">
                      <div className="absolute top-1 left-1 right-1 bottom-1 bg-red-600 rounded border-2 border-white"></div>
                      <div className="absolute top-2 left-2 w-2 h-1 bg-white rounded"></div>
                    </div>
                  </div>
                  
                  {/* Speed Lines */}
                  <div className="absolute left-4 top-1/2 w-8 h-0.5 bg-white opacity-60 transform -translate-y-1/2"></div>
                  <div className="absolute left-6 top-1/2 w-6 h-0.5 bg-white opacity-40 transform -translate-y-2"></div>
                  <div className="absolute left-8 top-1/2 w-4 h-0.5 bg-white opacity-20 transform translate-y-1"></div>
                </div>
                
                {/* Floating Food Icons */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Pizza className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '0.8s'}}>
                  <span className="text-white text-lg">🍔</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ride With Orado
              </h3>
              <p className="text-gray-600 text-sm">
                Join thousands of delivery heroes earning great money
              </p>
              <div className="mt-4 inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-blue-800 text-sm font-medium">Always Hiring</span>
              </div>
            </div>
          </div>

          {/* Partner Programme Card */}
          <div className="group bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-50"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="absolute top-12 right-16 w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute top-20 right-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute bottom-8 left-6 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute bottom-16 left-12 w-4 h-4 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
            
            {/* Main Illustration */}
            <div className="relative z-10 flex justify-center mb-8">
              <div className="relative">
                {/* Restaurant Scene */}
                <div className="w-56 h-40 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                  {/* Restaurant Building */}
                  <div className="relative">
                    {/* Main Building */}
                    <div className="w-24 h-24 bg-white rounded-xl shadow-xl border-4 border-green-500 relative">
                      {/* Store Sign */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        RESTAURANT
                      </div>
                      
                      {/* Windows */}
                      <div className="absolute top-3 left-2 w-4 h-4 bg-blue-200 rounded border-2 border-blue-400"></div>
                      <div className="absolute top-3 right-2 w-4 h-4 bg-blue-200 rounded border-2 border-blue-400"></div>
                      
                      {/* Door */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-brown-600 rounded-t-lg"></div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                    </div>
                    
                    {/* Chimney with Smoke */}
                    <div className="absolute -top-4 right-2 w-3 h-6 bg-red-600 rounded-t"></div>
                    <div className="absolute -top-8 right-1 text-gray-400 text-xs">💨</div>
                    
                    {/* Base/Foundation */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-gray-600 rounded-sm"></div>
                  </div>
                  
                  {/* Floating Food Items */}
                  <div className="absolute top-4 left-4 text-2xl animate-bounce">🍕</div>
                  <div className="absolute top-6 right-6 text-xl animate-bounce" style={{animationDelay: '0.5s'}}>🍔</div>
                  <div className="absolute bottom-8 left-6 text-lg animate-bounce" style={{animationDelay: '1s'}}>🥗</div>
                </div>
                
                {/* Chef Hat */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-200">
                  <div className="w-6 h-8 bg-white rounded-t-full relative">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-2 right-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Money/Earnings Symbol */}
                <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Partner Programme
              </h3>
              <p className="text-gray-600 text-sm">
                Grow your restaurant business with our platform
              </p>
              <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-green-800 text-sm font-medium">0% Commission</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Join the Food Revolution? 🚀
              </h2>
              <p className="text-orange-100 text-lg mb-6">
                Whether you're a rider or restaurant owner, we've got amazing opportunities waiting for you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors duration-300 shadow-lg">
                  Become a Rider
                </button>
                 <Link
                  to="/partner-with-orado"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-300 inline-block"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
