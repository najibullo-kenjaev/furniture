import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <SidebarNav />
      {/* offset for mobile hamburger */}
      <main className="flex-1 overflow-auto p-6 pt-20 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
}