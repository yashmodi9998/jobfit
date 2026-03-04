"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch} from 'lucide-react';

// Define the menu items for the dashboard sidebar, including their names, paths, and icons.
const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Analysis', href: '/reviewresume', icon: FileSearch },
  ];

// The DashboardSidebar component renders a navigation sidebar for the dashboard, highlighting the active route.
export default function DashboardSidebar() {
  // Get the current pathname to determine which menu item is active.
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-4 space-y-1">
      
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon 
              size={18} 
              className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}