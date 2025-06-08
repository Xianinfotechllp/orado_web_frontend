import React from 'react';
import SidebarItem from './SidebarItem';

const sidebarItems = [
  { name: 'Orders', path: '/my-account/orders' },
  { name: 'Orado One', path: '/my-account/premium' },
  { name: 'Favourites', path: '/my-account/favourites' },
  // { name: 'Payments', path: '/payments' },
  { name: 'Addresses', path: '/my-account/address' },
  { name: 'Settings', path: '/my-account/settings' },
  { name: 'Log Out', path: '/my-account/logout' }
];

const Sidebar = () => {
  return (
    <div className="w-64 p-4">
      <nav>
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem 
              key={item.name}
              name={item.name}
              path={item.path}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;