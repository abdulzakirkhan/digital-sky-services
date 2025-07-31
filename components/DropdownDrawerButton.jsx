"use client";

import { useState, useEffect } from "react";

export default function DropdownDrawerButton() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="relative inline-block text-left dropdown-container">
      {/* Main Button */}
      <button
        onClick={() => {
            setDrawerOpen(true);
            setDropdownOpen(false);
        }}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center gap-1"
      >
        Open Drawer
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute mt-2 w-48 bg-white rounded-lg shadow-xl z-10 overflow-hidden transition-all duration-200 origin-top-right ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        {isDropdownOpen && (
          <>
            <button
              className="w-full px-4 py-3 text-left text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-2"
              onClick={() => {
                setDrawerOpen(true);
                setDropdownOpen(false);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Open Drawer
            </button>
            <button
              className="w-full px-4 py-3 text-left text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-2"
              onClick={() => setDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Another Action
            </button>
          </>
        )}
      </div>

      {/* Drawer (slide-in panel) */}
      <div className={`fixed inset-0 flex justify-end z-30 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div className={`relative w-80 md:w-96 h-full bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Drawer Content</h3>
          <p className="text-gray-600">This is your drawer panel. You can place any content here.</p>
          
          <div className="mt-6 space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800">Tip</h4>
              <p className="text-sm text-blue-600 mt-1">Add your custom components here to create a beautiful sidebar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}