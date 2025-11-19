"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { href: '/', label: 'หน้าแรก Game' },
    { href: '/news', label: 'ข่าวเกม' },
    { href: '/newgame', label: 'เกมใหม่' },
    { href: '/gaminggear', label: 'เกมมิ่งเกียร์' },
    { href: '/tips', label: 'เรื่องน่ารู้เกมมิ่ง' },
    { href: '/e-sports', label: 'E-Sports' },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleDrawer}
        className="sm:hidden absolute top-1 left-1 z-50 bg-[#3ec9b0] text-white p-2.5 rounded-lg shadow-xl hover:bg-[#2da896] active:scale-95 transition-all duration-200"
        aria-label="เปิดเมนู"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer Menu */}
      <div
        className={`sm:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#24b197] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#1a9a82]">
            <h2 className="text-white text-xl font-bold">เมนู</h2>
            <button
              onClick={closeDrawer}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="ปิดเมนู"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Menu Items */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <ul className="py-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={closeDrawer}
                    className={`block px-6 py-4 text-white hover:bg-white hover:text-[#24b197] transition-colors border-b border-[#1a9a82]/30 ${
                      item.active ? 'text-[#24b197] font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:block nav w-full h-[45px]">
        <nav className="container h-full px-2 sm:px-4 md:px-6">
          <ul className="flex flex-wrap sm:flex-nowrap whitespace-nowrap">
            {menuItems.map((item, index) => (
              <li key={index} className={item.active ? 'active' : ''}>
                <Link href={item.href} className="text-sm sm:text-base md:text-lg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navigation;

