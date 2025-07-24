import React, { useState } from 'react';
import AppLayout from '../../components/userProfile/layout/AppLayout';
import Sidebar from '../../components/userProfile/navigation/Sidebar';
import Navbar from '../../components/layout/Navbar';
import WalletTopUp from '../../components/userProfile/wallet/WalletTopUp';
import WalletTransactions from '../../components/userProfile/wallet/WalletTransactions';
import { Menu } from 'lucide-react';

const WalletTopUpPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selected, setSelected] = useState("topup"); // "topup" or "transactions"

  return (
    <>
      <Navbar />
      <AppLayout>
        <div className="flex flex-col md:flex-row">
          {/* Mobile header with toggle */}
          <div className="md:hidden flex justify-between items-center p-4 bg-white border-b">
            <h2 className="text-xl font-semibold">Wallet</h2>
            <button onClick={() => setShowSidebar(!showSidebar)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar */}
          <div
            className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 border-r bg-white`}
          >
            <Sidebar />
          </div>

          {/* Main content with section navbar */}
          <div className="flex-1 p-4 md:p-6">
            {/* Mini navbar */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setSelected("topup")}
                className={`px-6 py-2 rounded-full font-light text-lg transition-all duration-200 
                  ${selected === "topup"
                    ? "bg-orange-600 text-white shadow"
                    : "bg-white border border-orange-200 text-orange-600 hover:bg-orange-50"}`}
              >
                Add Money
              </button>
              <button
                onClick={() => setSelected("transactions")}
                className={`px-6 py-2 rounded-full font-light text-lg transition-all duration-200 
                  ${selected === "transactions"
                    ? "bg-orange-600 text-white shadow"
                    : "bg-white border border-orange-200 text-orange-600 hover:bg-orange-50"}`}
              >
                Transactions
              </button>
            </div>
            {selected === "topup" ? <WalletTopUp /> : <WalletTransactions />}
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default WalletTopUpPage;
