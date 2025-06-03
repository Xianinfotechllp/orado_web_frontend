import React from 'react';
import AppStore from '../../../assets/appStore.avif';
import GooglePlay from '../../../assets/googleplay.avif';

const OradoOne = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* Left Content Section */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Orado One
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto lg:mx-0">
              Get free delivery and extra discounts all across Orado.
            </p>
            
            <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto lg:mx-0">
              Your Swiggy One benefits can be availed only on the Orado App.
            </p>
            
            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <a
                href="https://apps.apple.com/us/app/your-app-id" // <-- Replace with your real App Store link
                target="_blank"
                rel="noopener noreferrer"
                className="w-48 h-14 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
            >
                <img 
                src={AppStore} 
                alt="Download on the App Store"
                className="w-full h-full object-contain"
                />
            </a>

            <a
                href="https://play.google.com/store/apps/details?id=your.package.name" // <-- Replace with your real Google Play link
                target="_blank"
                rel="noopener noreferrer"
                className="w-48 h-14 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
            >
                <img 
                src={GooglePlay}
                alt="Get it on Google Play"
                className="w-full h-full object-contain"
                />
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OradoOne;