import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";

import AddToCart from "./pages/AddToCart/AddToCart";
import OrderManagement from "./pages/OrderManagement/OrderManagement";

import RestaurantDeatils from "./pages/RestaurantDetails/RestaurantDeatils";
import Signup from "./pages/Auth/SignUp";
import Faq from "./pages/Faq/Faq";

import OrdersPage from "./pages/UserProfile/OrdersPage";
import SettingsPage from "./pages/UserProfile/SettingsPage";
import NotificationPage from "./pages/Notification/NotificationPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import RestaurantApprovalsPage from "./pages/Admin/RestaurantApprovalsPage";
import AddRestaurantPage from "./pages/Admin/AddRestaurant";
import RestaurantList from "./pages/Admin/RestaurantList";
import CreateMenu from "./pages/Admin/CreateMenu";
import RestaurantCategories from "./pages/Admin/RestaurantCategories";
import CategoryItems from "./pages/Admin/CategoryItems";
import RestaurantPermissions from "./pages/Admin/RestaurantPermissions";
import Dashboard from "./pages/Admin/Dashboard";
import AddAdmin from "./pages/Admin/AddAdmin";
import AdminManage from "./pages/Admin/AdminManage";
import Ticket from "./pages/Admin/ticketSystem/Ticket";
import RestaurantCommission from "./pages/Admin/RestaurantCommission";
import AdminCustomerChatDashboard from "./pages/Admin/CustomerChats/AdminCustomerChatDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import AdminCustomerOrderPage from "./pages/Admin/customer/AdminCustomerOrderPage";
import RefundComponent from "./pages/Admin/customer/RefundComponent";
import RefundTransactionsPage from "./pages/Admin/RefundTransactionsPage";
import AccessLogs from "./pages/Admin/AdminAccessLogs";
import RestaurantOrderList from "./pages/Admin/RestaurantOrderList";
import RestaurantReviewsPage from "./pages/Admin/reviews/RestaurantReviewPage";
import RestaurantListforReviews from "./pages/Admin/reviews/RestaurantListforReviews";
import OfferManagement from "./pages/Admin/Offer/OfferManagement";
import CreateOffer from "./pages/Admin/Offer/CreateOffer";
import AssignOffer from "./pages/Admin/Offer/AssignOffer";
import RestaurantEarningsTable from "./pages/Admin/RestaurantEarningsTable";
import RestaurantListForOrders from "./pages/Admin/RestaurantListForOrders";
import SurgeAreaSelector from "./pages/Admin/Surge/SurgeAreaSelector";
import AdminNotificationSender from "./pages/Admin/notifications/AdminNotificationSender";
import SurgeAreaList from "./pages/Admin/Surge/SurgeAreaList";
import TaxManagementPanel from "./pages/Admin/FeeAndTaxSettings/TaxManagementPanel";
import DeliveryFeeSettings from "./pages/Admin/FeeAndTaxSettings/DeliveryFeeSettings";
import RestaurantEarningsv from "./pages/Admin/restauratnsEarnigs/RestaurantEarningsv";
import AdminRestaurantChatDashboard from "./pages/Admin/RestaurantChats/AdminRestaurantChatDashboard";
import OrderTable from "./pages/Admin/order/OrderTable";
import CityCreationMap from "./pages/Admin/city/CityCreationMap";
import PromoCodeManager from "./pages/Admin/Marketing/promotions/promoCode/ PromoCodeManager";
import CreateLoyaltyPoints from "./pages/Admin/Marketing/promotions/loyalityPoints/CreateLoyaltyPoints";
import RestaurantTables from "./pages/Admin/Restaurants/RestaurantTables";
import RestaurantConfigPage from "./pages/Admin/Restaurants/RestaurantConfigPage";
import AdminAgentDashboardLayout from "./layouts/AdminAgentDashboardLayout";
import AgentDashboardSettings from "./pages/AgentAdminDashboard/AgentDashboardSettings";
import CustomerCampaigns from "./pages/Admin/Marketing/pushCampaigns/CustomerCampaigns";
import RestaurantCampaigns from "./pages/Admin/Marketing/pushCampaigns/RestaurantCampaigns";
import RolesPage from "./pages/Admin/configure/userSettings/Rolepage";
import AddRolePage from "./pages/Admin/configure/userSettings/AddRolepage";
import ManagerManagement from "./pages/Admin/configure/userSettings/ManagerManagement";
import AddManager from "./pages/Admin/configure/userSettings/AddManager";
import EditRolePage from "./pages/Admin/configure/userSettings/EditRolePage";
import EditManager from "./pages/Admin/configure/userSettings/EditManager";
import CatalogPage  from "./pages/Admin/products/CatalogPage ";
import ReferralPromotions from "./pages/Admin/Marketing/promotions/referal/ReferralPromotions";
import CommissionPage from "./pages/Admin/configure/orderSettings/CommissionPage";
import DeliverySettings from "./pages/Admin/configure/orderSettings/DeliverySettings";
import TerminologyPage from "./pages/Admin/configure/generalSettings/TerminologyPage";
import ManagerLogin from "./pages/Admin/manager/ManagerLogin";
import PreferencesPage from "./pages/Admin/configure/generalSettings/PerferencePage";
import OrderSettings from "./pages/Admin/configure/orderSettings/OrderSettings";
import CancellationSettings from "./pages/Admin/configure/orderSettings/CancellationSettings";
import DiscountPage from "./pages/Admin/Marketing/promotions/discount/DiscountPage";
import OrderDetails from "./pages/Admin/order/OrderDetail";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import CustomerDetailsPage from "./pages/Admin/customer/CustomerDetails";
import MerchantDetailsPage from "./pages/Admin/Restaurants/MerchantDetailsPage";
import MerchantConfiguration from "./pages/Admin/Restaurants/MerchantConfiguration";
import MerchantCataloguePage from "./pages/Admin/Restaurants/CataloguePage";
import GeofencePage from "./pages/Admin/configure/cityConfig/GeofencePage";
import GeofenceAdder from "./pages/Admin/configure/cityConfig/GeofenceAdder";
import CityList from "./pages/Admin/configure/cityConfig/CityList";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        <Route path="/add-to-cart" element={<AddToCart />} />
        <Route path="/order-management" element={<OrderManagement />} /> */}
{/* 
        <Route path="/restaurant/details/:restaurantId" element={<RestaurantDeatils />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/notifications" element={<NotificationPage />} /> */}

        {/* User Profile */}
        {/* <Route path="/my-account" element={<OrdersPage />} />
        <Route path="/my-account/orders" element={<OrdersPage />} />
        <Route path="/my-account/settings" element={<SettingsPage />} /> */}





        






        {/* Admin-Side */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
      



          <Route index element={<Dashboard />} />
          {/* restaurant-section */}
          <Route path="restaurant-approvals" element={<RestaurantApprovalsPage />} />
          <Route path="restaurant-add" element={<AddRestaurantPage />} />
          <Route path="restaurant-edit" element={<RestaurantList />} />

          <Route path="restaurant-table" element={<RestaurantTables/>} />
            <Route path="restaurant-config" element={<RestaurantConfigPage/>}  />
         


          <Route path="restaurant-createmenu" element={<CreateMenu />} />
          <Route path="restaurant-permission" element={<RestaurantPermissions />} />
          <Route path="restaurant-commission" element={<RestaurantCommission />} />
          <Route path="restaurant-order" element={<RestaurantListForOrders />} />
          <Route path="restaurant-feedback" element={<RestaurantListforReviews />} />
           <Route path="restaurant-earnings" element={<RestaurantEarningsTable />} />
           <Route path="restaurant-chats" element={<AdminRestaurantChatDashboard />} />
           <Route path="restaurant-earnings-summary/:restaurantId" element={<RestaurantEarningsv />} />

        {/* Restuarnt */}
            <Route path="merchants/merchant-details/:id" element={<MerchantDetailsPage/>}  />
               <Route path="merchants/merchant-config/:id" element={<MerchantConfiguration/>}/>
               <Route path="merchants/merchant-catelogue/:id" element={<MerchantCataloguePage/>}/>

          {/* offer section */}
          <Route path="create-offer" element={<CreateOffer />} />
          <Route path="assign-offer" element={<AssignOffer />} />
          <Route path="manage-offer" element={<OfferManagement />} />

          
          {/* admin-section */}
          <Route path="admin-add" element={<AddAdmin />} />
          <Route path="admin-manage" element={<AdminManage />} />
          <Route path="admin-ticket" element={<Ticket />} />
          <Route path="access-logs" element={<AccessLogs />} />
          <Route path="admin-surge" element={<SurgeAreaSelector />} />
          <Route path="admin-surge-list" element={<SurgeAreaList/>}    />

          
          {/* products */}
              {/* CatalogPage */}
       
                <Route path="merchants/catalogue" element={<CatalogPage />} />


          {/* Customer  */}

              <Route path="customer/:customerId/details" element={<CustomerDetailsPage/>}  />

          {/* marketing */}

             { /* >>  promotions */}
                {/* promocodes */}
                <Route path="admin-promotions-promo" element={<PromoCodeManager/>}  />
                <Route  path="promotions-discount"  element={<DiscountPage/>} />
                <Route path="promotion-loyalty-points" element={<CreateLoyaltyPoints/>} />
                 <Route path="promotion-referal" element={<ReferralPromotions/>}  />
                {/* push campings */}
                <Route path="campaigns-customer" element={<CustomerCampaigns/>} />
                <Route path="campaigns-restaurant" element={<RestaurantCampaigns/>} />








                {/* configration menu */}
                   {/* >  user settings */}
                <Route path="role-management" element={<RolesPage/>} />
                <Route path="role-add" element={<AddRolePage/>} />
                <Route path="role-edit/:roleId" element={<EditRolePage/>}  />

                <Route path="manger-managment" element={<ManagerManagement/>}  />
                <Route path="manger-add" element={<AddManager/>}  />
                <Route path="manger-edit/:mangerId" element={<EditManager/>}  />

                 {/* order settings */}
                <Route path="order/settings" element={<OrderSettings/>} />
                <Route path="order/cancel-settings" element={<CancellationSettings/>}  />
                <Route path="commission/setup" element={<CommissionPage/>}  />

                <Route path="delivery-settings"  element={<DeliverySettings/>}  />
                    
             {/* general settings */}
             <Route path="general/terminology" element={<TerminologyPage/>} />
             <Route path="general/preference" element={<PreferencesPage/>} />


            {/* city config */}
            <Route path="geofence" element={<GeofencePage/>} />
            <Route path="geofence/add" element={<GeofenceAdder/>} />
            <Route path="city/list" element={<CityList/>} />


            <Route path="admin-tax-management" element={<TaxManagementPanel />}    />
             <Route path="admin-deliveryfee-management" element={<DeliveryFeeSettings />}    />



          {/* admin-customer section */}
          <Route path="admin-customer-chat" element={<AdminCustomerChatDashboard />} />
          <Route path="user-managemnet" element={<UserManagement />} />
          <Route path="customer/:userId/orders" element={<AdminCustomerOrderPage />} />
          <Route path="order/refund" element={<RefundComponent />} />
          <Route path="refund/transactions" element={<RefundTransactionsPage />} />
        
          <Route path="notification-sender"  element={<AdminNotificationSender/>} />
        <Route path="order/table" element={<OrderTable/>} />
        <Route path="order/table/details/:orderId" element={<OrderDetails/>}  />
        <Route path="add-city" element={<CityCreationMap/>}  />
          {/* Add more nested routes as needed */}
        </Route>
        <Route path="/restaurants/:restaurantId/orders" element={<RestaurantOrderList />} />

        <Route path="/restaurants/:restaurantId/categories" element={<RestaurantCategories />} />
        <Route path="/feedback/restaurants/:restaurantId" element={<RestaurantReviewsPage />} />
        <Route
          path="/restaurants/:restaurantId/categories/:categoryId/items"
          element={<CategoryItems />}
/>







<Route  path="/admin/agent-dashboard" element={<AdminAgentDashboardLayout/>}>

 <Route index element={<AdminAgentDashboardLayout />} />

    
</Route>

<Route path="/admin/agent-dashboard/settings" element={<AgentDashboardSettings />} />



{/* manager logins */}
    <Route path="/manger/login" element={<ManagerLogin/>}/>

    <Route  path="/manager/dashboard" element={<ManagerDashboard/>}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
