import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Image,
  Newspaper,
  ChevronRight,
  Cog,
  UserRoundCog,
  UserSearch,
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('/users');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    {
      icon: Users,
      label: 'Users Management',
      path: '/users',
      submenu: [
        { label: 'Players', path: '/users/players' },
        { label: 'Clubs', path: '/users/clubs' },
        { label: 'Districts', path: '/users/districts' },
        { label: 'States', path: '/users/states' },
        { label: 'Admins', path: '/users/admins' },
        { label: 'Event Admins', path: '/users/eventAdmin' }
      ]
    },
    {
      icon: UserCheck,
      label: 'Pending Approvals',
      path: '/approvals',
      submenu: [
        { label: 'Players', path: '/approvals/players' },
        { label: 'Clubs', path: '/approvals/clubs' },
        { label: 'Districts', path: '/approvals/districts' },
        { label: 'States', path: '/approvals/states' }
      ]
    },
    { icon: Calendar, label: 'Events', path: '/events' },
    {
      icon: Cog,
      label: 'Events Details',
      path: '/eventsDetails',
      submenu: [
        { label: 'Event Participation', path: '/eventsDetails/participation' },
        { label: 'Payment Report', path: '/eventsDetails/payment' },
      ]
    },
    { icon: UserRoundCog, label: 'Event Official', path: '/eventOfficial' },
    { icon: UserSearch, label: 'Event Organisers', path: '/eventOrganisers' },
    { icon: Image, label: 'Gallery', path: '/gallery' },
    { icon: Newspaper, label: 'News', path: '/news' },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-full p-4 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <h1 className="text-xl font-bold text-blue-400">Sports Management</h1>
          <p className="text-slate-400 text-sm">ERP System</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.path}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === item.path ? null : item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transform transition-transform ${
                        expandedMenu === item.path ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedMenu === item.path && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-700 pb-3">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Confirm Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
