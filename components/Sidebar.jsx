'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  FileText, 
  Mail, 
  Shield, 
  Users, 
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Website Visits',
    href: '/dashboard/website-visits',
    icon: BarChart3,
  },
  {
    name: 'Newsletter Blogs',
    href: '/dashboard/newsletter-blogs',
    icon: FileText,
  },
  {
    name: 'Email Interactions',
    href: '/dashboard/email-interactions',
    icon: Mail,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64 fixed left-0 top-0 bottom-0">
      <div className="flex items-center h-16 px-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Sales Dashboard</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
}