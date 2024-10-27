"use client"

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to the login page or home page after signing out
  };
  return (
    <div>
      <nav className="flex justify-between z-50 sticky top-0 bg-black text-white p-3">
        <h2><Link href="/">SK POS</Link></h2>
        <button onClick={toggleDrawer} className="text-white">
          ☰ {/* Hamburger Icon */}
        </button>
      </nav>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className={`fixed left-0 top-0 w-64 h-full bg-black text-white p-4 z-40 transition-all transform duration-500 delay-200 ease-in-out ${isDrawerOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-64'}`}>
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          <ul className="flex flex-col gap-2">
            <li>Home</li>
            <li onClick={toggleDrawer}>
              <Link href="/menu" className="hover:underline">
                Menu
              </Link>
            </li>
            <li>Account</li>
            {/* Add more menu items as needed */}
          </ul>
          <button onClick={toggleDrawer} className="mt-4 text-red-500">Close</button>
          <button
            onClick={handleSignOut}
            className="mt-auto text-red-500 absolute left-4 bottom-4"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleDrawer}
        />
      )}
    </div>
  );
};

export default Navbar;
